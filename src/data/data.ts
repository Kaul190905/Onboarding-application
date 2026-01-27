import type { User, Task, Activity } from '../types/index';

// Mock Users Data with passwords
export const users: User[] = [
    // Admin
    {
        id: 'admin-1',
        name: 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@school.edu',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=3b82f6&color=fff',
    },
    // Teachers
    {
        id: 'teacher-1',
        name: 'Prof. James Wilson',
        email: 'james.wilson@school.edu',
        password: 'teacher123',
        role: 'teacher',
        avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=10b981&color=fff',
    },
    {
        id: 'teacher-2',
        name: 'Dr. Emily Chen',
        email: 'emily.chen@school.edu',
        password: 'teacher123',
        role: 'teacher',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=8b5cf6&color=fff',
    },
    {
        id: 'teacher-3',
        name: 'Prof. Michael Brown',
        email: 'michael.brown@school.edu',
        password: 'teacher123',
        role: 'teacher',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=f59e0b&color=fff',
    },
    // Students - Assigned to Teacher 1
    {
        id: 'student-1',
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-1',
        avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=ec4899&color=fff',
    },
    {
        id: 'student-2',
        name: 'Bob Smith',
        email: 'bob.smith@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-1',
        avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=06b6d4&color=fff',
    },
    {
        id: 'student-3',
        name: 'Carol Davis',
        email: 'carol.davis@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-1',
        avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=84cc16&color=fff',
    },
    // Students - Assigned to Teacher 2
    {
        id: 'student-4',
        name: 'Daniel Lee',
        email: 'daniel.lee@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-2',
        avatar: 'https://ui-avatars.com/api/?name=Daniel+Lee&background=f97316&color=fff',
    },
    {
        id: 'student-5',
        name: 'Eva Martinez',
        email: 'eva.martinez@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-2',
        avatar: 'https://ui-avatars.com/api/?name=Eva+Martinez&background=14b8a6&color=fff',
    },
    // Students - Assigned to Teacher 3
    {
        id: 'student-6',
        name: 'Frank Garcia',
        email: 'frank.garcia@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-3',
        avatar: 'https://ui-avatars.com/api/?name=Frank+Garcia&background=a855f7&color=fff',
    },
    {
        id: 'student-7',
        name: 'Grace Kim',
        email: 'grace.kim@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-3',
        avatar: 'https://ui-avatars.com/api/?name=Grace+Kim&background=ef4444&color=fff',
    },
    {
        id: 'student-8',
        name: 'Henry Wang',
        email: 'henry.wang@student.edu',
        password: 'student123',
        role: 'student',
        assignedTo: 'teacher-3',
        avatar: 'https://ui-avatars.com/api/?name=Henry+Wang&background=6366f1&color=fff',
    },
];

// Mock Tasks Data
export const initialTasks: Task[] = [];


// Mock Activities Data
export const activities: Activity[] = [
    {
        id: 'activity-1',
        type: 'task_completed',
        description: 'Alice Johnson completed "Mathematics Mid-Term Exam" with 92% score',
        userId: 'student-1',
        timestamp: '2026-01-20T10:30:00',
    },
    {
        id: 'activity-2',
        type: 'task_created',
        description: 'Prof. Wilson assigned "Chemistry Lab Task" to Alice Johnson',
        userId: 'teacher-1',
        timestamp: '2026-01-17T14:15:00',
    },
    {
        id: 'activity-3',
        type: 'task_completed',
        description: 'Carol Davis completed "Computer Science Coding Test" with 88% score',
        userId: 'student-3',
        timestamp: '2026-01-20T09:45:00',
    },
    {
        id: 'activity-4',
        type: 'user_added',
        description: 'Henry Wang enrolled in the Task program',
        userId: 'student-8',
        timestamp: '2026-01-15T08:00:00',
    },
    {
        id: 'activity-5',
        type: 'task_updated',
        description: 'Bob Smith started "English Literature Essay"',
        userId: 'student-2',
        timestamp: '2026-01-19T11:20:00',
    },
    {
        id: 'activity-6',
        type: 'task_completed',
        description: 'Eva Martinez completed "Spanish Oral Examination" with 95% score',
        userId: 'student-5',
        timestamp: '2026-01-21T16:00:00',
    },
    {
        id: 'activity-7',
        type: 'task_completed',
        description: 'Grace Kim completed "Music Theory Exam" with 90% score',
        userId: 'student-7',
        timestamp: '2026-01-22T13:30:00',
    },
    {
        id: 'activity-8',
        type: 'task_created',
        description: 'Prof. Brown assigned "Physical Education Fitness Test" to Henry Wang',
        userId: 'teacher-3',
        timestamp: '2026-01-20T10:00:00',
    },
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const authenticateUser = (email: string, password: string): User | null => {
    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    return user || null;
};

export const getStudentsByTeacher = (teacherId: string): User[] => {
    return users.filter(user => user.role === 'student' && user.assignedTo === teacherId);
};

export const getTasksByStudent = (studentId: string, tasks: Task[]): Task[] => {
    return tasks.filter(task => task.assignedTo === studentId);
};

export const getTasksByTeacher = (teacherId: string, tasks: Task[]): Task[] => {
    const studentIds = getStudentsByTeacher(teacherId).map(s => s.id);
    return tasks.filter(task => studentIds.includes(task.assignedTo));
};

export const getAllStudents = (): User[] => {
    return users.filter(user => user.role === 'student');
};

export const getAllTeachers = (): User[] => {
    return users.filter(user => user.role === 'teacher');
};

