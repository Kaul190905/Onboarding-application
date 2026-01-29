import { useAuth } from '../contexts/AuthContext';
import { getUserById, getStudentsByTeacher } from '../data/data';
import { User, Mail, Users, GraduationCap } from 'lucide-react';

export const MyTeacher = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'student') {
        return null;
    }

    const teacher = user.assignedTo ? getUserById(user.assignedTo) : null;
    const studentsCount = teacher ? getStudentsByTeacher(teacher.id).length : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-violet-600" />
                    <h2 className="text-lg font-bold text-slate-900">My Teacher</h2>
                </div>
                <p className="text-slate-600">
                    Your assigned teacher and mentor.
                </p>
            </div>

            {/* Teacher Card */}
            {teacher ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-24 h-24 rounded-full ring-4 ring-violet-100"
                        />

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{teacher.name}</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-violet-600 mb-4">
                                <GraduationCap className="w-5 h-5" />
                                <span className="font-medium">Teacher</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Email</p>
                                        <p className="font-medium text-slate-900">{teacher.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Students</p>
                                        <p className="font-medium text-slate-900">{studentsCount} students assigned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No teacher assigned</h3>
                    <p className="text-slate-500">You don't have a teacher assigned yet.</p>
                </div>
            )}
        </div>
    );
};
