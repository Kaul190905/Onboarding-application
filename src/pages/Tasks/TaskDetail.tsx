import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById } from '../../data/data';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    Loader2,
    PlayCircle,
    FileText,
    User
} from 'lucide-react';
import type { TaskStatus } from '../../types';

export const TaskDetail = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const { user, tasks, updateTaskStatus } = useAuth();

    const task = tasks.find(t => t.id === taskId);
    const assignee = task ? getUserById(task.assignedTo) : null;
    const assigner = task ? getUserById(task.assignedBy) : null;

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Task not found</h2>
                <p className="text-slate-500 mb-6">The Task you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/tasks')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tasks
                </button>
            </div>
        );
    }

    const statusConfig = {
        open: { label: 'Not Started', color: 'bg-slate-100 text-slate-600', icon: Circle },
        'in-progress': { label: 'In Progress', color: 'bg-amber-50 text-amber-700', icon: Loader2 },
        completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
    };

    const config = statusConfig[task.status];
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

    const handleStatusChange = (newStatus: TaskStatus) => {
        updateTaskStatus(task.id, newStatus);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
            </button>

            {/* Main card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 lg:p-8 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{task.title}</h1>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
                            <config.icon className="w-4 h-4" />
                            <span>{config.label}</span>
                        </div>
                    </div>
                    {task.category && (
                        <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-sm font-medium">
                            {task.category}
                        </span>
                    )}
                </div>

                {/* Instructions */}
                <div className="p-6 lg:p-8 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Instructions</h3>
                    <p className="text-slate-700 leading-relaxed">{task.description}</p>
                </div>

                {/* Details grid */}
                <div className="p-6 lg:p-8 grid sm:grid-cols-2 gap-6 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-red-50' : 'bg-slate-100'}`}>
                            <Calendar className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-slate-500'}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Due Date</p>
                            <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Created</p>
                            <p className="font-medium text-slate-900">
                                {new Date(task.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    {assignee && (
                        <div className="flex items-start gap-3">
                            <img src={assignee.avatar} alt="" className="w-10 h-10 rounded-lg ring-2 ring-slate-100" />
                            <div>
                                <p className="text-sm text-slate-500">Student</p>
                                <p className="font-medium text-slate-900">{assignee.name}</p>
                            </div>
                        </div>
                    )}

                    {assigner && (
                        <div className="flex items-start gap-3">
                            <img src={assigner.avatar} alt="" className="w-10 h-10 rounded-lg ring-2 ring-slate-100" />
                            <div>
                                <p className="text-sm text-slate-500">Assigned By</p>
                                <p className="font-medium text-slate-900">{assigner.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions for students */}
                {user?.role === 'student' && task.assignedTo === user.id && task.status !== 'completed' && (
                    <div className="p-6 lg:p-8 bg-slate-50">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            {task.status === 'open' && (
                                <button
                                    onClick={() => handleStatusChange('in-progress')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Start Task
                                </button>
                            )}
                            {task.status === 'in-progress' && (
                                <button
                                    onClick={() => handleStatusChange('completed')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Submit Task
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


