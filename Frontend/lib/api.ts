const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL|| 'http://localhost:5004';

export class ApiError extends Error {
    constructor(public status: number, message: string){
        super(message);
        this.name ='ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if(!response.ok){
        const error= await response.json().catch(() =>({
            message: "an error occured at resopen ok "
        }));

        throw new ApiError(response.status, error.message || response.statusText);
    }

    return response.json();
}

export const api={
    async get<T>(endpoint: string): Promise<T>{
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
             credentials: 'include',
        });
        return handleResponse<T>(response);
    },

    async post<T>(endpoint: string, data: any): Promise<T> {
        const response= await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },
    
    async put<T>(endpoint: string, data: any): Promise<T> {
        const response= await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },

      async delete<T>(endpoint: string, data: any): Promise<T> {
        const response= await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        return handleResponse<T>(response);
    },

}