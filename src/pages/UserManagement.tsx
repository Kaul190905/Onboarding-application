import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AddUserModal } from '../components/admin/AddUserModal';
import {
    Users,
    UserPlus,
    GraduationCap,
    Search,
    ChevronDown,
    Trash2,
} from 'lucide-react';

export const UserManagement = () => {
    const { user, users, updateUser, deleteUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [defaultRole, setDefaultRole] = useState<'student' | 'teacher'>('student');

    if (!user || user.role !== 'admin') {
        return null;
    }

    const teachers = users.filter(u => u.role === 'teacher');
    const filteredUsers = users.filter(u => {
        if (u.role === 'admin') return false;
        if (filterRole !== 'all' && u.role !== filterRole) return false;
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
        }
        return true;
    });

    const handleTeacherAssignment = (studentId: string, teacherId: string) => {
        updateUser(studentId, { assignedTo: teacherId || undefined });
    };

    const handleAddUser = (role: 'student' | 'teacher') => {
        setDefaultRole(role);
        setIsAddModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-violet-600" />
                            <h1 className="text-xl font-bold text-slate-900">User Management</h1>
                        </div>
                        <p className="text-slate-600">
                            Add new students and teachers, and manage student-teacher assignments.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleAddUser('student')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Student
                        </button>
                        <button
                            onClick={() => handleAddUser('teacher')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Teacher
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    {/* Role Filter */}
                    <div className="relative">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as 'all' | 'student' | 'teacher')}
                            className="appearance-none px-4 py-2.5 pr-10 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Assigned To</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-100/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.avatar}
                                                alt={u.name}
                                                className="w-10 h-10 rounded-full ring-2 ring-slate-100"
                                            />
                                            <span className="font-medium text-slate-900">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${u.role === 'teacher'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-violet-50 text-violet-700'
                                            }`}>
                                            {u.role === 'teacher' ? (
                                                <Users className="w-3.5 h-3.5" />
                                            ) : (
                                                <GraduationCap className="w-3.5 h-3.5" />
                                            )}
                                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.role === 'student' ? (
                                            <div className="relative inline-block">
                                                <select
                                                    value={u.assignedTo || ''}
                                                    onChange={(e) => handleTeacherAssignment(u.id, e.target.value)}
                                                    className="appearance-none px-3 py-1.5 pr-8 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {teachers.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No users found</h3>
                        <p className="text-slate-500">
                            {searchTerm ? 'Try adjusting your search or filters.' : 'Add your first student or teacher to get started.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <p className="text-2xl font-bold text-violet-600">{users.filter(u => u.role === 'student').length}</p>
                    <p className="text-sm text-slate-500">Total Students</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.role === 'teacher').length}</p>
                    <p className="text-sm text-slate-500">Total Teachers</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.role === 'student' && u.assignedTo).length}</p>
                    <p className="text-sm text-slate-500">Assigned Students</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-600">{users.filter(u => u.role === 'student' && !u.assignedTo).length}</p>
                    <p className="text-sm text-slate-500">Unassigned Students</p>
                </div>
            </div>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                defaultRole={defaultRole}
            />
        </div>
    );
};
