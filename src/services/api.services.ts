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
      console.error("Validation Error (422) Detail:", JSON.stringify(error, null, 2));
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
/**
   * Intenta refrescar el token de acceso utilizando una petición al backend.
   * Si el refresco falla (ej. sesión expirada), invalida el almacenamiento local.
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/usuario/refresh`, {
        method: "POST",
        credentials: "include", // Incluye cookies (refresh token) para la validación
        headers: {
          "Content-Type": "application/json",
        },
      });

// Si el servidor rechaza el refresco, cerramos sesión de forma segura >:)
      if (!response.ok) {
        tokenStorage.clear();
        return null;
      }

      const data = (await response.json()) as { access_token?: string };
      if (!data.access_token) {
        tokenStorage.clear();
        return null;
      }
// Almacenamos el nuevo JWT y lo retornamos para reintentar la petición original
      tokenStorage.setAccessToken(data.access_token);
      return data.access_token;
    } catch {
      tokenStorage.clear();
      return null;
    }
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
// Obtención del token actual (JWT)
    const token = tokenStorage.getAccessToken();
    const headers: Record<string, string> = {};
// Inyección de autorización (Bearer Token)
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
   * Ejecuta peticiones uwu HTTP con lógica de reintento ante expiración del token. :3
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
// Detección de expiración de token (401)
    const isRefreshEndpoint = endpoint.includes("/api/v1/usuario/refresh");
    if (response.status === 401 && retryOnAuthFailure && !isRefreshEndpoint) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        // Reintento recursivo de la petición original con el nuevo token
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

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
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
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${this.baseURL}${endpoint}`);

      const isFormData = data instanceof FormData;
      if (isFormData) {
        console.log(`Sending FormData to ${endpoint}:`);
        (data as FormData).forEach((value, key) => {
          console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        });
      }

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

      xhr.onload = async () => {
        if (xhr.status === 0) {
          return reject(new Error("Error de conexión"));
        }

        const headers = new Headers();
        const contentType = xhr.getResponseHeader("content-type");
        const contentLength = xhr.getResponseHeader("content-length");

        if (contentType) headers.set("content-type", contentType);
        if (contentLength) headers.set("content-length", contentLength);

        const response = new Response(xhr.responseText || null, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers,
        });

        try {
          const result = await this.handleResponse<T>(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      xhr.onerror = () => {
        reject(new Error("Error de conexión"));
      };

      if (isFormData) {
        xhr.send(data as FormData);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export const apiService = new ApiService();
