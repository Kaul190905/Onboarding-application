import { useNavigate } from 'react-router-dom';
import type { Task } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById } from '../../data/data';
import { Calendar, CheckCircle2, Circle, Loader2, PlayCircle } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    showAssignee?: boolean;
    showActions?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, showAssignee = false, showActions = false }) => {
    const { user, updateTaskStatus } = useAuth();
    const navigate = useNavigate();
    const assignee = getUserById(task.assignedTo);

    const statusConfig = {
        open: {
            label: 'Not Started',
            color: 'bg-slate-100 text-slate-600',
            icon: Circle,
        },
        'in-progress': {
            label: 'In Progress',
            color: 'bg-amber-50 text-amber-700',
            icon: Loader2,
        },
        completed: {
            label: 'Completed',
            color: 'bg-emerald-50 text-emerald-700',
            icon: CheckCircle2,
        },
    };

    const config = statusConfig[task.status];
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

    const handleStartTask = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateTaskStatus(task.id, 'in-progress');
    };

    const handleCompleteTask = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateTaskStatus(task.id, 'completed');
    };

    return (
        <div
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="group bg-slate-50 rounded-xl border border-slate-100 p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {task.title}
                </h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    <config.icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                {task.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                {task.category && (
                    <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded text-xs font-medium">
                        {task.category}
                    </span>
                )}
            </div>

            {/* Assignee */}
            {showAssignee && assignee && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-6 h-6 rounded-full ring-2 ring-slate-100"
                    />
                    <span className="text-sm text-slate-600">{assignee.name}</span>
                </div>
            )}

            {/* Actions for students */}
            {showActions && user?.role === 'student' && task.status !== 'completed' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    {task.status === 'open' && (
                        <button
                            onClick={handleStartTask}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <PlayCircle className="w-4 h-4" />
                            Start Task
                        </button>
                    )}
                    {task.status === 'in-progress' && (
                        <button
                            onClick={handleCompleteTask}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Submit Task
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


