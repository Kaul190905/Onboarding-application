import { apiPost, apiGet, setToken } from './api';

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    assignedTo?: string;
    token: string;
}

interface MeResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    assignedTo?: string;
}

export const loginAPI = async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiPost<AuthResponse>('/auth/login', { email, password });
    setToken(data.token);
    return data;
};

export const registerAPI = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
    assignedTo?: string;
}): Promise<AuthResponse> => {
    const data = await apiPost<AuthResponse>('/auth/register', userData);
    setToken(data.token);
    return data;
};

export const getMeAPI = async (): Promise<MeResponse> => {
    return apiGet<MeResponse>('/auth/me');
};
