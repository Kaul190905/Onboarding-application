import { useAuth } from '../../contexts/AuthContext';
import { getTasksByStudent, getUserById } from '../../data/data';
import { TaskList } from '../../components/tasks/TaskList';
import {
    FileText,
    CheckCircle2,
    Clock,
    Circle,
    BookOpen,
    Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
    const { user, tasks } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const myTasks = getTasksByStudent(user.id, tasks);
    const completedTasks = myTasks.filter(t => t.status === 'completed');
    const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
    const openTasks = myTasks.filter(t => t.status === 'open');
    const pendingTasks = myTasks.filter(t => t.status !== 'completed');

    const progress = myTasks.length > 0
        ? Math.round((completedTasks.length / myTasks.length) * 100)
        : 0;

    const mentor = user.assignedTo ? getUserById(user.assignedTo) : null;

    const stats = [
        { label: 'Total Tasks', value: myTasks.length, icon: FileText, color: 'violet' },
        { label: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'emerald' },
        { label: 'In Progress', value: inProgressTasks.length, icon: Clock, color: 'amber' },
        { label: 'Not Started', value: openTasks.length, icon: Circle, color: 'slate' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Card with Progress */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Progress Circle */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                className="fill-none stroke-slate-100"
                                strokeWidth="8"
                            />
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                className="fill-none stroke-violet-500"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${progress * 3.02} 302`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-slate-900">{progress}%</span>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                            Welcome, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-slate-600 mb-4">
                            You've completed {completedTasks.length} of {myTasks.length} Tasks.
                            {pendingTasks.length > 0 ? ` You have ${pendingTasks.length} pending.` : ' Great job!'}
                        </p>
                        {mentor && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl inline-flex">
                                <img
                                    src={mentor.avatar}
                                    alt={mentor.name}
                                    className="w-8 h-8 rounded-full ring-2 ring-white"
                                />
                                <div>
                                    <p className="text-xs text-slate-500">Your Teacher</p>
                                    <p className="text-sm font-medium text-slate-900">{mentor.name}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => navigate('/tasks')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <BookOpen className="w-5 h-5" />
                            View Tasks
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-slate-50 rounded-xl border border-slate-100 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3
                            ${stat.color === 'emerald' ? 'bg-emerald-50' :
                                stat.color === 'amber' ? 'bg-amber-50' :
                                    stat.color === 'slate' ? 'bg-slate-100' : 'bg-violet-50'}`}
                        >
                            <stat.icon className={`w-5 h-5
                                ${stat.color === 'emerald' ? 'text-emerald-600' :
                                    stat.color === 'amber' ? 'text-amber-600' :
                                        stat.color === 'slate' ? 'text-slate-500' : 'text-violet-600'}`}
                            />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Tasks */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Pending Tasks</h2>
                            <span className="text-sm text-slate-500">{pendingTasks.length} remaining</span>
                        </div>
                        <TaskList tasks={pendingTasks} showActions={true} />
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Completed</h2>
                        <Trophy className="w-5 h-5 text-emerald-500" />
                    </div>
                    {completedTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500">No completed Tasks yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {completedTasks.slice(0, 5).map((Task) => (
                                <div key={Task.id} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{Task.title}</p>
                                        <p className="text-xs text-slate-500">{Task.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


