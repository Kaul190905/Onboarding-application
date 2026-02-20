import { apiGet, apiPost, apiPatch } from './api';

interface TicketResponse {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    submittedBy: { _id: string; name: string; email: string } | string;
    attachments: Array<{
        _id: string;
        name: string;
        type: string;
        url: string;
        mimeType?: string;
    }>;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export const getTicketsAPI = async (): Promise<TicketResponse[]> => {
    return apiGet<TicketResponse[]>('/tickets');
};

export const submitTicketAPI = async (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
    attachments?: Array<{
        name: string;
        type: string;
        url: string;
        mimeType?: string;
    }>;
}): Promise<TicketResponse> => {
    return apiPost<TicketResponse>('/tickets', data);
};

export const updateTicketAPI = async (id: string, data: {
    status?: string;
    adminNotes?: string;
}): Promise<TicketResponse> => {
    return apiPatch<TicketResponse>(`/tickets/${id}`, data);
};
