import { tokenStorage } from "@/auth/utils/tokenStorage";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiService {
  private readonly baseURL: string;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    if (!baseURL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL no está definida en las variables de entorno",
      );
    }

    this.baseURL = baseURL;
  }

  private async parseErrorResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json().catch(() => null);
    }

    return response.text().catch(() => null);
  }

  private buildErrorMessage(error: unknown, response: Response): string {
    if (response.status === 422) {
      // Return detail gracefully
    }

    if (
      error &&
      typeof error === "object" &&
      "detail" in error &&
      typeof (error as { detail?: unknown }).detail === "string"
    ) {
      return (error as { detail: string }).detail;
    }

    if (
      error &&
      typeof error === "object" &&
      "detail" in error &&
      Array.isArray((error as { detail?: unknown }).detail) &&
      (error as { detail: Array<{ msg?: string }> }).detail.length > 0
    ) {
      return (
        (error as { detail: Array<{ msg?: string }> }).detail[0]?.msg ||
        `Error: ${response.status}`
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }

    if (typeof error === "string" && error.trim()) {
      return error;
    }

    if (response.statusText) {
      return response.statusText;
    }

    return `Error: ${response.status}`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      const message = this.buildErrorMessage(error, response);

      throw new ApiError(response.status, message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength === "0") {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return undefined as T;
    }

    const text = await response.text();

    if (!text.trim()) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  }
  private async executeRefreshRequest(): Promise<string | null> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        return null;
      }

      const response = await fetch(`${this.baseURL}/api/v1/usuario/refresh`, {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        tokenStorage.clear();
        return null;
      }

      const data = (await response.json()) as { access_token?: string, refresh_token?: string };
      if (!data.access_token || !data.refresh_token) {
        tokenStorage.clear();
        return null;
      }

      tokenStorage.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch {
      tokenStorage.clear();
      return null;
    }
  }

  /**
   * Evita llamadas concurrentes de refresh con una sola promesa compartida.
   */
  private async refreshAccessToken(): Promise<string | null> {
    this.refreshPromise ??= this.executeRefreshRequest().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }
  /**
     * Construye los headers necesarios para cada petición, inyectando el token JWT
     * si existe en el almacenamiento.
     */
  private buildRequestOptions(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    data?: unknown,
  ): RequestInit {
    const options: RequestInit = {
      method,
      credentials: "include",
    };
    const token = tokenStorage.getAccessToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (data !== undefined) {
      if (data instanceof FormData) {
        options.body = data;
      } else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }
    }

    if (Object.keys(headers).length > 0) {
      options.headers = headers;
    }

    return options;
  }
  /**
   * Ejecuta peticiones HTTP con reintento único cuando el access token expiró.
   */
  private async request<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    endpoint: string,
    data?: unknown,
    retryOnAuthFailure = true,
  ): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions(method, data),
    );
    const isRefreshEndpoint = endpoint.includes("/api/v1/usuario/refresh");
    if (response.status === 401 && retryOnAuthFailure && !isRefreshEndpoint) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        return this.request<T>(method, endpoint, data, false);
      }
    }

    return this.handleResponse<T>(response);
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  public async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  public async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("PATCH", endpoint, data);
  }

  public async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  }

  public async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("DELETE", endpoint, data);
  }

  public async getBlob(endpoint: string): Promise<Blob> {
    const options = this.buildRequestOptions("GET");

    options.headers = {
      ...options.headers,
      "Accept": "application/pdf"
    };

    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      options
    );

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      const message = this.buildErrorMessage(error, response);
      throw new ApiError(response.status, message);
    }

    const blob = await response.blob();
    return new Blob([blob], { type: "application/pdf" });
  }

  public async postWithProgress<T>(
    endpoint: string,
    data: unknown,
    onProgress?: (percentage: number) => void,
  ): Promise<T> {
    const executePost = () =>
      new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${this.baseURL}${endpoint}`);
        xhr.withCredentials = true;

        const token = tokenStorage.getAccessToken();
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        const isFormData = data instanceof FormData;
        if (!isFormData) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentage = Math.round((event.loaded * 100) / event.total);
              onProgress(percentage);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status === 0) {
            reject(new Error("Error de conexión"));
            return;
          }

          const headers = new Headers();
          const contentType = xhr.getResponseHeader("content-type");
          const contentLength = xhr.getResponseHeader("content-length");

          if (contentType) headers.set("content-type", contentType);
          if (contentLength) headers.set("content-length", contentLength);

          resolve(
            new Response(xhr.responseText || null, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers,
            }),
          );
        };

        xhr.onerror = () => {
          reject(new Error("Error de conexión"));
        };

        if (isFormData) {
          xhr.send(data);
        } else {
          xhr.send(JSON.stringify(data));
        }
      });

    const firstResponse = await executePost();
    const isRefreshEndpoint = endpoint.includes("/api/v1/usuario/refresh");

    if (firstResponse.status === 401 && !isRefreshEndpoint) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        const retriedResponse = await executePost();
        return this.handleResponse<T>(retriedResponse);
      }
    }

    return this.handleResponse<T>(firstResponse);
  }
}

export const apiService = new ApiService();
