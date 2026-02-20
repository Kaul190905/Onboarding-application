import { apiGet, apiPost } from './api';

interface PollResponse {
    _id: string;
    title: string;
    description: string;
    options: Array<{
        _id: string;
        text: string;
        votes: string[];
    }>;
    createdBy: { _id: string; name: string; email: string } | string;
    createdByRole: string;
    targetAudience: string;
    status: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const getPollsAPI = async (): Promise<PollResponse[]> => {
    return apiGet<PollResponse[]>('/polls');
};

export const createPollAPI = async (data: {
    title: string;
    description: string;
    options: string[];
    targetAudience: string;
    expiresAt?: string;
}): Promise<PollResponse> => {
    return apiPost<PollResponse>('/polls', data);
};

export const votePollAPI = async (pollId: string, optionId: string): Promise<{ message: string }> => {
    return apiPost<{ message: string }>(`/polls/${pollId}/vote`, { optionId });
};
