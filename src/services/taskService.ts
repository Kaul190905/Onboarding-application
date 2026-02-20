import { apiGet, apiPost, apiPatch } from './api';

interface TaskResponse {
    _id: string;
    title: string;
    description: string;
    status: string;
    assignedTo: { _id: string; name: string; email: string } | string;
    assignedBy: { _id: string; name: string; email: string } | string;
    dueDate: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}

export const getTasksAPI = async (): Promise<TaskResponse[]> => {
    return apiGet<TaskResponse[]>('/tasks');
};

export const createTaskAPI = async (data: {
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    category?: string;
}): Promise<TaskResponse> => {
    return apiPost<TaskResponse>('/tasks', data);
};

export const updateTaskStatusAPI = async (id: string, status: string): Promise<TaskResponse> => {
    return apiPatch<TaskResponse>(`/tasks/${id}`, { status });
};
