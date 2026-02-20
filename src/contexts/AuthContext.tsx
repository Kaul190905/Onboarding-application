import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Task, SupportTicket, TicketStatus, Poll } from '../types';
import { loginAPI, registerAPI, getMeAPI } from '../services/authService';
import { getUsersAPI, updateUserAPI, deleteUserAPI } from '../services/userService';
import { getTasksAPI, createTaskAPI, updateTaskStatusAPI } from '../services/taskService';
import { getTicketsAPI, submitTicketAPI, updateTicketAPI } from '../services/ticketService';
import { getPollsAPI, createPollAPI, votePollAPI } from '../services/pollService';
import { getToken, removeToken } from '../services/api';
import { generateAvatarUrl } from '../data/data';

// Map a user response from the API to our frontend User type
const mapUser = (u: Record<string, unknown>): User => ({
    id: (u._id as string) || (u.id as string) || '',
    name: u.name as string,
    email: u.email as string,
    password: '', // never returned from API
    role: u.role as User['role'],
    avatar: u.avatar as string | undefined,
    assignedTo: u.assignedTo as string | undefined,
});

// Map a task response
const mapTask = (t: Record<string, unknown>): Task => {
    const assignedTo = t.assignedTo as Record<string, unknown> | string;
    const assignedBy = t.assignedBy as Record<string, unknown> | string;
    return {
        id: (t._id as string) || (t.id as string) || '',
        title: t.title as string,
        description: t.description as string,
        status: t.status as Task['status'],
        assignedTo: typeof assignedTo === 'object' && assignedTo !== null ? (assignedTo._id as string) : (assignedTo as string),
        assignedBy: typeof assignedBy === 'object' && assignedBy !== null ? (assignedBy._id as string) : (assignedBy as string),
        dueDate: t.dueDate as string,
        createdAt: (t.createdAt as string) || new Date().toISOString(),
        category: t.category as string | undefined,
    };
};

// Map a ticket response
const mapTicket = (t: Record<string, unknown>): SupportTicket => {
    const submittedBy = t.submittedBy as Record<string, unknown> | string;
    const attachments = (t.attachments as Array<Record<string, unknown>>) || [];
    return {
        id: (t._id as string) || (t.id as string) || '',
        title: t.title as string,
        description: t.description as string,
        category: t.category as string,
        priority: t.priority as SupportTicket['priority'],
        status: t.status as SupportTicket['status'],
        submittedBy: typeof submittedBy === 'object' && submittedBy !== null ? (submittedBy._id as string) : (submittedBy as string),
        attachments: attachments.map(a => ({
            id: (a._id as string) || (a.id as string) || '',
            name: a.name as string,
            type: a.type as 'file' | 'link',
            url: a.url as string,
            mimeType: a.mimeType as string | undefined,
        })),
        createdAt: t.createdAt as string,
        updatedAt: t.updatedAt as string,
        adminNotes: t.adminNotes as string | undefined,
    };
};

// Map a poll response
const mapPoll = (p: Record<string, unknown>): Poll => {
    const createdBy = p.createdBy as Record<string, unknown> | string;
    const options = (p.options as Array<Record<string, unknown>>) || [];
    return {
        id: (p._id as string) || (p.id as string) || '',
        title: p.title as string,
        description: p.description as string,
        options: options.map(o => ({
            id: (o._id as string) || (o.id as string) || '',
            text: o.text as string,
            votes: (o.votes as string[]) || [],
        })),
        createdBy: typeof createdBy === 'object' && createdBy !== null ? (createdBy._id as string) : (createdBy as string),
        createdByRole: p.createdByRole as Poll['createdByRole'],
        targetAudience: p.targetAudience as Poll['targetAudience'],
        status: p.status as Poll['status'],
        createdAt: p.createdAt as string,
        expiresAt: p.expiresAt as string | undefined,
    };
};

interface AuthContextType {
    user: User | null;
    users: User[];
    tasks: Task[];
    tickets: SupportTicket[];
    polls: Poll[];
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
    addUser: (userData: Omit<User, 'id' | 'avatar'>) => Promise<{ success: boolean; error?: string; user?: User }>;
    updateUser: (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'assignedTo'>>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    submitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<SupportTicket>;
    updateTicket: (ticketId: string, updates: { status?: TicketStatus; adminNotes?: string }) => Promise<void>;
    getTicketsByUser: (userId: string) => SupportTicket[];
    // Poll functions
    createPoll: (pollData: Omit<Poll, 'id' | 'createdAt' | 'status'>) => Promise<Poll>;
    votePoll: (pollId: string, optionId: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
    closePoll: (pollId: string) => void;
    getPollsForUser: () => Poll[];
    refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all data from API
    const fetchAllData = useCallback(async () => {
        try {
            const [usersData, tasksData, ticketsData, pollsData] = await Promise.all([
                getUsersAPI().catch(() => []),
                getTasksAPI().catch(() => []),
                getTicketsAPI().catch(() => []),
                getPollsAPI().catch(() => []),
            ]);
            setUsers(usersData.map(u => mapUser(u as unknown as Record<string, unknown>)));
            setTasks(tasksData.map(t => mapTask(t as unknown as Record<string, unknown>)));
            setTickets(ticketsData.map(t => mapTicket(t as unknown as Record<string, unknown>)));
            setPolls(pollsData.map(p => mapPoll(p as unknown as Record<string, unknown>)));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const meData = await getMeAPI();
                setUser(mapUser(meData as unknown as Record<string, unknown>));
                await fetchAllData();
            } catch {
                removeToken();
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [fetchAllData]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const data = await loginAPI(email, password);
            setUser(mapUser(data as unknown as Record<string, unknown>));
            await fetchAllData();
            return { success: true };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
        setUsers([]);
        setTasks([]);
        setTickets([]);
        setPolls([]);
    };

    const updateTaskStatusFn = async (taskId: string, status: Task['status']) => {
        try {
            const updated = await updateTaskStatusAPI(taskId, status);
            const mappedTask = mapTask(updated as unknown as Record<string, unknown>);
            setTasks(prev =>
                prev.map(task => task.id === taskId ? mappedTask : task)
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        try {
            const created = await createTaskAPI({
                title: taskData.title,
                description: taskData.description,
                assignedTo: taskData.assignedTo,
                dueDate: taskData.dueDate,
                category: taskData.category,
            });
            const mappedTask = mapTask(created as unknown as Record<string, unknown>);
            setTasks(prev => [...prev, mappedTask]);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const addUser = async (userData: Omit<User, 'id' | 'avatar'>): Promise<{ success: boolean; error?: string; user?: User }> => {
        try {
            const avatar = generateAvatarUrl(userData.name);
            const data = await registerAPI({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
                avatar,
                assignedTo: userData.assignedTo,
            });
            const newUser = mapUser(data as unknown as Record<string, unknown>);
            setUsers(prev => [...prev, newUser]);
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to add user' };
        }
    };

    const updateUserFn = async (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'assignedTo'>>) => {
        try {
            const updated = await updateUserAPI(userId, updates);
            const mappedUser = mapUser(updated as unknown as Record<string, unknown>);
            setUsers(prev =>
                prev.map(u => u.id === userId ? mappedUser : u)
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUserFn = async (userId: string) => {
        try {
            await deleteUserAPI(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const submitTicketFn = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SupportTicket> => {
        try {
            const created = await submitTicketAPI({
                title: ticketData.title,
                description: ticketData.description,
                category: ticketData.category,
                priority: ticketData.priority,
                attachments: ticketData.attachments?.map(a => ({
                    name: a.name,
                    type: a.type,
                    url: a.url,
                    mimeType: a.mimeType,
                })),
            });
            const mappedTicket = mapTicket(created as unknown as Record<string, unknown>);
            setTickets(prev => [...prev, mappedTicket]);
            return mappedTicket;
        } catch (error) {
            console.error('Error submitting ticket:', error);
            throw error;
        }
    };

    const updateTicketFn = async (ticketId: string, updates: { status?: TicketStatus; adminNotes?: string }) => {
        try {
            const updated = await updateTicketAPI(ticketId, updates);
            const mappedTicket = mapTicket(updated as unknown as Record<string, unknown>);
            setTickets(prev =>
                prev.map(ticket => ticket.id === ticketId ? mappedTicket : ticket)
            );
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const getTicketsByUser = (userId: string): SupportTicket[] => {
        return tickets.filter(ticket => ticket.submittedBy === userId);
    };

    // Poll functions
    const createPollFn = async (pollData: Omit<Poll, 'id' | 'createdAt' | 'status'>): Promise<Poll> => {
        try {
            const created = await createPollAPI({
                title: pollData.title,
                description: pollData.description,
                options: pollData.options.map(o => o.text),
                targetAudience: pollData.targetAudience,
                expiresAt: pollData.expiresAt,
            });
            const mappedPoll = mapPoll(created as unknown as Record<string, unknown>);
            setPolls(prev => [...prev, mappedPoll]);
            return mappedPoll;
        } catch (error) {
            console.error('Error creating poll:', error);
            throw error;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const votePollFn = async (pollId: string, optionId: string, _studentId: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await votePollAPI(pollId, optionId);
            // Refresh polls to get updated vote counts
            const pollsData = await getPollsAPI().catch(() => []);
            setPolls(pollsData.map(p => mapPoll(p as unknown as Record<string, unknown>)));
            return { success: true };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Vote failed' };
        }
    };

    const closePoll = (pollId: string) => {
        setPolls(prev =>
            prev.map(p =>
                p.id === pollId ? { ...p, status: 'closed' as const } : p
            )
        );
    };

    const getPollsForUser = (): Poll[] => {
        if (!user) return [];

        if (user.role === 'admin') {
            return polls;
        } else if (user.role === 'teacher') {
            return polls.filter(p =>
                p.createdBy === user.id ||
                (p.createdByRole === 'admin' && p.targetAudience === 'students-and-staff')
            );
        } else {
            return polls.filter(p =>
                p.targetAudience === 'students' ||
                p.targetAudience === 'students-and-staff'
            );
        }
    };

    const refreshData = async () => {
        await fetchAllData();
    };

    return (
        <AuthContext.Provider value={{
            user,
            users,
            tasks,
            tickets,
            polls,
            loading,
            login,
            logout,
            updateTaskStatus: updateTaskStatusFn,
            addTask,
            addUser,
            updateUser: updateUserFn,
            deleteUser: deleteUserFn,
            submitTicket: submitTicketFn,
            updateTicket: updateTicketFn,
            getTicketsByUser,
            createPoll: createPollFn,
            votePoll: votePollFn,
            closePoll,
            getPollsForUser,
            refreshData,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
