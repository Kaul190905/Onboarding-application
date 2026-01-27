import { useAuth } from '../contexts/AuthContext';
import { getAllStudents, getAllTeachers, getTasksByStudent } from '../data/data';
import {
    Shield,
    BookOpen,
    GraduationCap,
    BarChart3,
    TrendingUp,
    FileText,
    CheckCircle2,
    Users
} from 'lucide-react';

export const OnboardingTree = () => {
    const { user, tasks } = useAuth();

    if (!user || user.role !== 'admin') {
        return null;
    }

    const students = getAllStudents();
    const teachers = getAllTeachers();

    // Calculate analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // Subject performance
    const subjects = [...new Set(tasks.map(t => t.category).filter(Boolean))];
    const subjectStats = subjects.map(subject => {
        const subjectTasks = tasks.filter(t => t.category === subject);
        const completed = subjectTasks.filter(t => t.status === 'completed').length;
        const rate = subjectTasks.length > 0
            ? Math.round((completed / subjectTasks.length) * 100)
            : 0;
        return { subject, total: subjectTasks.length, completed, rate };
    }).sort((a, b) => b.total - a.total);

    // Top performing students
    const studentPerformance = students.map(student => {
        const studentTasks = getTasksByStudent(student.id, tasks);
        const completed = studentTasks.filter(t => t.status === 'completed').length;
        const rate = studentTasks.length > 0
            ? Math.round((completed / studentTasks.length) * 100)
            : 0;
        return { student, total: studentTasks.length, completed, rate };
    }).sort((a, b) => b.rate - a.rate);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-violet-600" />
                    <h2 className="text-lg font-bold text-slate-900">Task Analytics</h2>
                </div>
                <p className="text-slate-600">
                    Overview of Task performance across all subjects and students.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
                            <p className="text-sm text-slate-500">Total Tasks</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
                            <p className="text-sm text-slate-500">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{completionRate}%</p>
                            <p className="text-sm text-slate-500">Completion Rate</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
                            <p className="text-sm text-slate-500">Subjects</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Subject Performance */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Subject Performance</h3>
                    <div className="space-y-4">
                        {subjectStats.slice(0, 8).map(({ subject, total, completed, rate }) => (
                            <div key={subject} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-900">{subject}</span>
                                        <span className="text-sm text-slate-500">{completed}/{total}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${rate >= 75 ? 'bg-emerald-500' :
                                                    rate >= 50 ? 'bg-violet-500' :
                                                        rate >= 25 ? 'bg-amber-500' : 'bg-red-400'
                                                }`}
                                            style={{ width: `${rate}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 w-12 text-right">{rate}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Students */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Students</h3>
                    <div className="space-y-3">
                        {studentPerformance.slice(0, 8).map(({ student, total, completed, rate }, index) => (
                            <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                        index === 1 ? 'bg-slate-200 text-slate-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                'bg-slate-100 text-slate-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full ring-2 ring-slate-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{student.name}</p>
                                    <p className="text-xs text-slate-500">{completed}/{total} completed</p>
                                </div>
                                <span className={`text-sm font-semibold ${rate >= 75 ? 'text-emerald-600' :
                                        rate >= 50 ? 'text-violet-600' : 'text-slate-600'
                                    }`}>
                                    {rate}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">1</p>
                    <p className="text-sm text-slate-500">Administrator</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
                    <p className="text-sm text-slate-500">Teachers</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                    <p className="text-sm text-slate-500">Students</p>
                </div>
            </div>
        </div>
    );
};

