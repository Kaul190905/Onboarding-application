import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    X,
    User,
    Mail,
    Lock,
    GraduationCap,
    Users,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultRole: 'student' | 'teacher';
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, defaultRole }) => {
    const { addUser, users } = useAuth();
    const [role, setRole] = useState<'student' | 'teacher'>(defaultRole);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const teachers = users.filter(u => u.role === 'teacher');

    useEffect(() => {
        setRole(defaultRole);
    }, [defaultRole]);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAssignedTo('');
        setError('');
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Create user
        const result = addUser({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
            assignedTo: role === 'student' && assignedTo ? assignedTo : undefined,
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 1500);
        } else {
            setError(result.error || 'Failed to create user');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-50 rounded-2xl border border-slate-100 shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        Add New {role === 'student' ? 'Student' : 'Teacher'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'student'
                                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <GraduationCap className="w-5 h-5" />
                                <span className="font-medium">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${role === 'teacher'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Teacher</span>
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter full name"
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === 'student' ? 'student@student.edu' : 'teacher@school.edu'}
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assign to Teacher (Students only) */}
                    {role === 'student' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Assign to Teacher <span className="text-slate-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">No teacher assigned</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>{role === 'student' ? 'Student' : 'Teacher'} created successfully!</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={success}
                        className={`w-full py-3 font-medium rounded-xl transition-colors ${role === 'student'
                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            } ${success ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Create {role === 'student' ? 'Student' : 'Teacher'}
                    </button>
                </form>
            </div>
        </div>
    );
};
