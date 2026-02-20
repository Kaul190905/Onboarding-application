const API_BASE_URL = 'http://localhost:5000/api';

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
};

export const apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await apiFetch(endpoint);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const apiPost = async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const apiPatch = async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
    const response = await apiFetch(endpoint, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }
    return response.json();
};
