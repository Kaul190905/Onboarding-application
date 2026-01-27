import { useAuth } from '../../contexts/AuthContext';
import { getStudentsByTeacher, getTasksByTeacher, getUserById } from '../../data/data';
import { TaskList } from '../../components/tasks/TaskList';
import {
    Users,
    FileText,
    CheckCircle2,
    Clock,
    ArrowRight,
    TrendingUp,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
    const { user, tasks } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const myStudents = getStudentsByTeacher(user.id);
    const myTasks = getTasksByTeacher(user.id, tasks);
    const completedTasks = myTasks.filter(t => t.status === 'completed');
    const pendingTasks = myTasks.filter(t => t.status !== 'completed');

    const stats = [
        { label: 'My Students', value: myStudents.length, icon: Users, color: 'violet' },
        { label: 'Total Tasks', value: myTasks.length, icon: FileText, color: 'violet' },
        { label: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'emerald' },
        { label: 'Pending', value: pendingTasks.length, icon: Clock, color: 'amber' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-slate-600">
                            You have {myStudents.length} students with {pendingTasks.length} pending Tasks to review.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-task')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Create Task
                    </button>
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
                            ${stat.color === 'emerald' ? 'bg-emerald-50' : stat.color === 'amber' ? 'bg-amber-50' : 'bg-violet-50'}`}
                        >
                            <stat.icon className={`w-5 h-5
                                ${stat.color === 'emerald' ? 'text-emerald-600' : stat.color === 'amber' ? 'text-amber-600' : 'text-violet-600'}`}
                            />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* My Students */}
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Student Progress</h2>
                        <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {myStudents.map((student) => {
                            const studentTasks = tasks.filter(t => t.assignedTo === student.id);
                            const completed = studentTasks.filter(t => t.status === 'completed').length;
                            const total = studentTasks.length;
                            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="w-10 h-10 rounded-full ring-2 ring-slate-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{student.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-violet-500 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{completed}/{total}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Pending Tasks</h2>
                            <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                                View all
                            </button>
                        </div>
                        <TaskList tasks={pendingTasks.slice(0, 6)} showAssignee={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};


