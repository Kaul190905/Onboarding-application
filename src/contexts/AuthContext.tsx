import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Task, SupportTicket, TicketStatus } from '../types';
import { initialTasks, users as initialUsers, generateUserId, generateAvatarUrl } from '../data/data';

interface AuthContextType {
    user: User | null;
    users: User[];
    tasks: Task[];
    tickets: SupportTicket[];
    login: (email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
    updateTaskStatus: (taskId: string, status: Task['status']) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    addUser: (userData: Omit<User, 'id' | 'avatar'>) => { success: boolean; error?: string; user?: User };
    updateUser: (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'assignedTo'>>) => void;
    deleteUser: (userId: string) => void;
    submitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => SupportTicket;
    updateTicket: (ticketId: string, updates: { status?: TicketStatus; adminNotes?: string }) => void;
    getTicketsByUser: (userId: string) => SupportTicket[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);

    const login = (email: string, password: string): { success: boolean; error?: string } => {
        // Search in current users state (includes newly added users)
        const foundUser = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
    };

    const updateTaskStatus = (taskId: string, status: Task['status']) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === taskId ? { ...task, status } : task
            )
        );
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setTasks(prev => [...prev, newTask]);
    };

    const addUser = (userData: Omit<User, 'id' | 'avatar'>): { success: boolean; error?: string; user?: User } => {
        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { success: false, error: 'A user with this email already exists' };
        }

        const newUser: User = {
            ...userData,
            id: generateUserId(userData.role as 'student' | 'teacher', users),
            avatar: generateAvatarUrl(userData.name),
        };

        setUsers(prev => [...prev, newUser]);
        return { success: true, user: newUser };
    };

    const updateUser = (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'assignedTo'>>) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === userId ? { ...u, ...updates } : u
            )
        );
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const submitTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): SupportTicket => {
        const now = new Date().toISOString();
        const newTicket: SupportTicket = {
            ...ticketData,
            id: `ticket-${Date.now()}`,
            status: 'open',
            createdAt: now,
            updatedAt: now,
        };
        setTickets(prev => [...prev, newTicket]);
        return newTicket;
    };

    const updateTicket = (ticketId: string, updates: { status?: TicketStatus; adminNotes?: string }) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
                    : ticket
            )
        );
    };

    const getTicketsByUser = (userId: string): SupportTicket[] => {
        return tickets.filter(ticket => ticket.submittedBy === userId);
    };

    return (
        <AuthContext.Provider value={{
            user,
            users,
            tasks,
            tickets,
            login,
            logout,
            updateTaskStatus,
            addTask,
            addUser,
            updateUser,
            deleteUser,
            submitTicket,
            updateTicket,
            getTicketsByUser
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

