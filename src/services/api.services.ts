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
  private baseURL: string;

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

  private buildRequestOptions(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    data?: unknown,
  ): RequestInit {
    const options: RequestInit = {
      method,
    };

    if (data !== undefined) {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(data);
    }

    return options;
  }

  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions("GET"),
    );

    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions("POST", data),
    );

    return this.handleResponse<T>(response);
  }

  public async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions("PATCH", data),
    );

    return this.handleResponse<T>(response);
  }

  public async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions("PUT", data),
    );

    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(
      `${this.baseURL}${endpoint}`,
      this.buildRequestOptions("DELETE"),
    );

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();
