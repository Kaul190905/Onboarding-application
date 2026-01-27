// User roles in the system
export type Role = 'admin' | 'teacher' | 'student';

// Task status types
export type TaskStatus = 'open' | 'in-progress' | 'completed';

// User interface
export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Added for authentication
    role: Role;
    avatar?: string;
    assignedTo?: string; // For students: teacher's id they are assigned to
}

// Task interface
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo: string; // Student id
    assignedBy: string; // Admin or Teacher id
    dueDate: string;
    createdAt: string;
    category?: string;
}

// Activity feed item
export interface Activity {
    id: string;
    type: 'task_created' | 'task_completed' | 'task_updated' | 'user_added';
    description: string;
    userId: string;
    timestamp: string;
}

