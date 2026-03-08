class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api';
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if(!response.ok) {
            const error = await response.json().catch(() => ({message: "Error parsing error response"}));
            throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    public async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.handleResponse<T>(response);
    }

    public async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    public async put<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    public async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.handleResponse<T>(response);
    }
}

export const apiService = new ApiService();