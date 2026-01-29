import { useAuth } from '../contexts/AuthContext';
import { getStudentsByTeacher, getTasksByStudent } from '../data/data';
import { GraduationCap, CheckCircle2, Clock, Circle } from 'lucide-react';

export const Students = () => {
    const { user, tasks } = useAuth();

    if (!user || user.role !== 'teacher') {
        return null;
    }

    const myStudents = getStudentsByTeacher(user.id);

    // Calculate overall class stats
    const totalTasks = tasks.filter(t =>
        myStudents.some(s => s.id === t.assignedTo)
    ).length;
    const completedTotal = tasks.filter(t =>
        myStudents.some(s => s.id === t.assignedTo) && t.status === 'completed'
    ).length;
    const avgCompletion = totalTasks > 0
        ? Math.round((completedTotal / totalTasks) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Student Performance</h2>
                        <p className="text-slate-600">
                            Track Task progress and completion rates for your {myStudents.length} students.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-violet-600">{totalTasks}</p>
                            <p className="text-xs text-slate-500">Total Tasks</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">{avgCompletion}%</p>
                            <p className="text-xs text-slate-500">Avg. Completion</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myStudents.map((student) => {
                    const studentTasks = getTasksByStudent(student.id, tasks);
                    const completed = studentTasks.filter(t => t.status === 'completed').length;
                    const inProgress = studentTasks.filter(t => t.status === 'in-progress').length;
                    const open = studentTasks.filter(t => t.status === 'open').length;
                    const total = studentTasks.length;
                    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                    return (
                        <div
                            key={student.id}
                            className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-12 h-12 rounded-full ring-2 ring-slate-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{student.name}</h3>
                                    <p className="text-sm text-slate-500 truncate">{student.email}</p>
                                </div>
                                <GraduationCap className="w-5 h-5 text-violet-500 flex-shrink-0" />
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-slate-600">Completion Rate</span>
                                    <span className="font-semibold text-slate-900">{progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${progress >= 80 ? 'bg-emerald-500' :
                                            progress >= 50 ? 'bg-violet-500' :
                                                progress >= 25 ? 'bg-amber-500' : 'bg-slate-400'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-lg font-bold">{completed}</span>
                                    </div>
                                    <p className="text-xs text-emerald-700">Done</p>
                                </div>
                                <div className="text-center p-2 bg-amber-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 text-amber-600 mb-0.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-lg font-bold">{inProgress}</span>
                                    </div>
                                    <p className="text-xs text-amber-700">Active</p>
                                </div>
                                <div className="text-center p-2 bg-slate-100 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 text-slate-600 mb-0.5">
                                        <Circle className="w-3.5 h-3.5" />
                                        <span className="text-lg font-bold">{open}</span>
                                    </div>
                                    <p className="text-xs text-slate-600">Pending</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {myStudents.length === 0 && (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No students assigned</h3>
                    <p className="text-slate-500">You don't have any students assigned to you yet.</p>
                </div>
            )}
        </div>
    );
};


