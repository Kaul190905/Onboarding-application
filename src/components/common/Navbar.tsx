import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
    title?: string;
}

// Map routes to titles
const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/tasks': 'My Tasks',
    '/all-tasks': 'All Tasks',
    '/create-task': 'Create Task',
    '/onboarding-tree': 'Analytics',
    '/students': 'My Students',
};

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine page title from route
    const pageTitle = title || routeTitles[location.pathname] ||
        (location.pathname.startsWith('/tasks/') ? 'Task Details' : 'Dashboard');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Page Title */}
                <div className="flex items-center gap-4">
                    <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
                    <h1 className="text-xl lg:text-2xl font-bold text-slate-900">{pageTitle}</h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full"></span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className="w-9 h-9 rounded-full ring-2 ring-slate-100"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-slate-50 rounded-xl shadow-lg border border-slate-100 py-2 animate-in">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                                <div className="border-t border-slate-100 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


