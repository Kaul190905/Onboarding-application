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

// Support Ticket types
export type TicketStatus = 'open' | 'in-progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Attachment {
    id: string;
    name: string;
    type: 'file' | 'link';
    url: string;  // For files: base64 data URL, for links: external URL
    mimeType?: string;
}

export interface SupportTicket {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: TicketPriority;
    status: TicketStatus;
    submittedBy: string;  // User ID
    attachments: Attachment[];
    createdAt: string;
    updatedAt: string;
    adminNotes?: string;
}

// Poll types
export type PollStatus = 'active' | 'closed';

export interface PollOption {
    id: string;
    text: string;
    votes: string[]; // Array of student IDs who voted
}

export interface Poll {
    id: string;
    title: string;
    description: string;
    options: PollOption[];
    createdBy: string;      // Admin or Teacher ID
    createdByRole: Role;    // 'admin' or 'teacher'
    targetAudience: 'students' | 'students-and-staff';
    status: PollStatus;
    createdAt: string;
    expiresAt?: string;     // Optional expiration
}

