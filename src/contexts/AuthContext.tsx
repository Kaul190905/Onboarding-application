import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Task } from '../types';
import { initialTasks, authenticateUser } from '../data/data';

interface AuthContextType {
    user: User | null;
    tasks: Task[];
    login: (email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
    updateTaskStatus: (taskId: string, status: Task['status']) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const login = (email: string, password: string): { success: boolean; error?: string } => {
        const foundUser = authenticateUser(email, password);
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

    return (
        <AuthContext.Provider value={{ user, tasks, login, logout, updateTaskStatus, addTask }}>
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


