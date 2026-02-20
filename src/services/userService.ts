import { apiGet, apiPatch, apiDelete } from './api';

interface UserResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    assignedTo?: string;
}

export const getUsersAPI = async (): Promise<UserResponse[]> => {
    return apiGet<UserResponse[]>('/users');
};

export const updateUserAPI = async (id: string, data: {
    name?: string;
    email?: string;
    assignedTo?: string;
}): Promise<UserResponse> => {
    return apiPatch<UserResponse>(`/users/${id}`, data);
};

export const deleteUserAPI = async (id: string): Promise<{ message: string }> => {
    return apiDelete<{ message: string }>(`/users/${id}`);
};
