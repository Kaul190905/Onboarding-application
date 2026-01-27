import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        navigate('/login');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left side - Brand panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-12 flex-col justify-between">
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

            {/* Right side - Register form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Create an account</h2>
                        <p className="text-slate-600">Enter your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Role field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                I am a
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 focus:ring-4 focus:ring-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-slate-400">
                        © 2026 Gradeflow. Student Task Platform.
                    </p>
                </div>
            </div>
        </div>
    );
};
