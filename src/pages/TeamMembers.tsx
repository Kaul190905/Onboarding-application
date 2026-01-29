import { useAuth } from '../contexts/AuthContext';
import { getStudentsByTeacher, getUserById } from '../data/data';
import { Users, Mail, GraduationCap } from 'lucide-react';

export const TeamMembers = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'student') {
        return null;
    }

    // Get the student's teacher, then get all students assigned to the same teacher
    const teacher = user.assignedTo ? getUserById(user.assignedTo) : null;
    const teamMembers = teacher ? getStudentsByTeacher(teacher.id).filter(s => s.id !== user.id) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-violet-600" />
                    <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
                </div>
                <p className="text-slate-600">
                    Your fellow students assigned to the same teacher.
                </p>
            </div>

            {/* Team Members Grid */}
            {teamMembers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-14 h-14 rounded-full ring-2 ring-slate-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{member.name}</h3>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                        <GraduationCap className="w-4 h-4" />
                                        <span>Student</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100/50 rounded-lg px-3 py-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{member.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No team members</h3>
                    <p className="text-slate-500">You don't have any team members assigned to the same teacher.</p>
                </div>
            )}
        </div>
    );
};
