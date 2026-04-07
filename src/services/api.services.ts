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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => null);

      let message = `Error: ${response.status}`;

      if (typeof error?.detail === "string") {
        message = error.detail;
      } else if (Array.isArray(error?.detail) && error.detail.length > 0) {
        message = error.detail[0]?.msg || `Error: ${response.status}`;
      } else if (typeof error?.message === "string") {
        message = error.message;
      } else if (response.statusText) {
        message = response.statusText;
      }

      throw new ApiError(response.status, message);
    }

    return response.json();
  }

  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  public async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
    });
    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();
