import { useAuth } from '../contexts/AuthContext';
import { getAllStudents, getAllTeachers, getTasksByStudent } from '../data/data';
import {
    Shield,
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

    // Student completion data
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
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-violet-600" />
                    <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
                </div>
                <p className="text-slate-600">
                    Overview of task completion across all students.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
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
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
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
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
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
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                            <p className="text-sm text-slate-500">Students</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Completion */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Student Completion</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {studentPerformance.map(({ student, total, completed, rate }) => (
                        <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full ring-2 ring-white"
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

            {/* Summary Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">1</p>
                    <p className="text-sm text-slate-500">Administrator</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{teachers.length}</p>
                    <p className="text-sm text-slate-500">Teachers</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
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
