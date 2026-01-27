import { useAuth } from '../../contexts/AuthContext';
import { users, activities, getAllStudents, getAllTeachers } from '../../data/data';
import { TaskList } from '../../components/tasks/TaskList';
import {
    Users,
    GraduationCap,
    CheckCircle2,
    Clock,
    TrendingUp,
    Activity,
    ArrowRight,
    FileText
} from 'lucide-react';

export const AdminDashboard = () => {
    const { user, tasks } = useAuth();

    if (!user) return null;

    const students = getAllStudents();
    const teachers = getAllTeachers();
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

    const stats = [
        { label: 'Total Students', value: students.length, icon: GraduationCap, color: 'violet' },
        { label: 'Teachers', value: teachers.length, icon: Users, color: 'violet' },
        { label: 'Total Tasks', value: tasks.length, icon: FileText, color: 'violet' },
        { label: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'emerald' },
        { label: 'In Progress', value: inProgressTasks.length, icon: Clock, color: 'amber' },
        { label: 'Completion Rate', value: `${Math.round((completedTasks.length / tasks.length) * 100)}%`, icon: TrendingUp, color: 'violet' },
    ];

    const recentTasks = tasks
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

    return (
        <div className="space-y-8">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                            Welcome back, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-slate-600">
                            Monitor student Tasks, track progress, and manage your Task platform.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm">
                        View Reports
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-shadow"
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
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                        <Activity className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {activities.slice(0, 5).map((activity) => {
                            const activityUser = users.find(u => u.id === activity.userId);
                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <img
                                        src={activityUser?.avatar}
                                        alt=""
                                        className="w-8 h-8 rounded-full ring-2 ring-slate-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 line-clamp-2">{activity.description}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
                            <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                                View all
                            </button>
                        </div>
                        <TaskList tasks={recentTasks} showAssignee={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

