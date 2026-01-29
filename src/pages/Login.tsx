import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a brief loading state
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }

        setIsLoading(false);
    };

    // Demo credentials for easy testing
    const demoCredentials = [
        { role: 'Admin', email: 'sarah.mitchell@school.edu', password: 'admin123' },
        { role: 'Teacher', email: 'james.wilson@school.edu', password: 'teacher123' },
        { role: 'Student', email: 'alice.johnson@student.edu', password: 'student123' },
    ];

    const fillCredentials = (demoEmail: string, demoPassword: string) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left side - Brand panel with gradient matching logo (fixed) */}
            <div className="hidden lg:flex lg:w-1/2 fixed inset-y-0 left-0 bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-12 flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <img
                            src="/logo.png"
                            alt="Gradeflow"
                            className="h-40 w-auto brightness-0 invert"
                        />
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Onboarding<br />Platform
                    </h1>
                    <p className="text-violet-100 text-lg leading-relaxed max-w-md">
                        A modern Task platform for managing tests, exams, and quizzes.
                        Track progress, assign Tasks, and monitor student performance.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        'Create and assign Tasks easily',
                        'Track student progress and scores',
                        'Comprehensive analytics for educators',
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-violet-100">
                            <div className="w-2 h-2 bg-violet-300 rounded-full" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Login form (with left margin to account for fixed panel) */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 lg:ml-[50%]">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img
                            src="/logo.png"
                            alt="Gradeflow"
                            className="h-12 w-auto"
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
                        <p className="text-slate-600">Sign in to access your Tasks</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 focus:ring-4 focus:ring-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-4 text-center">Quick access with demo accounts</p>
                        <div className="grid gap-2">
                            {demoCredentials.map((demo) => (
                                <button
                                    key={demo.role}
                                    onClick={() => fillCredentials(demo.email, demo.password)}
                                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-200 rounded-xl text-left transition-colors group"
                                >
                                    <div>
                                        <span className="text-sm font-medium text-slate-900">{demo.role}</span>
                                        <p className="text-xs text-slate-500">{demo.email}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-slate-400">
                        © 2026 Gradeflow. Student Task Platform.
                    </p>
                </div>
            </div>
        </div>
    );
};
