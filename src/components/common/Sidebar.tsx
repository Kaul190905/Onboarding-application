import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    ClipboardList,
    Plus,
    Users,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    { path: '/all-tasks', label: 'All Tasks', icon: ClipboardList, roles: ['admin', 'teacher'] },
    { path: '/create-task', label: 'Create Task', icon: Plus, roles: ['admin', 'teacher'] },
    { path: '/onboarding-tree', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { path: '/students', label: 'My Students', icon: Users, roles: ['teacher'] },
    { path: '/team-members', label: 'Team Members', icon: Users, roles: ['student'] },
    { path: '/my-teacher', label: 'My Teacher', icon: Users, roles: ['student'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    if (!user) return null;

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className={`flex items-center h-16 px-4 border-b border-slate-100 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                {isCollapsed ? (
                    <img
                        src="/logo-icon.png"
                        alt="Gradeflow"
                        className="h-10 w-auto"
                    />
                ) : (
                    <img
                        src="/logo.png"
                        alt="Gradeflow"
                        className="h-20 w-auto"
                    />
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-violet-50 text-violet-600 font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                            ${isCollapsed ? 'justify-center' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="p-3 border-t border-slate-100">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 p-3 mb-2 bg-slate-50 rounded-xl">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full ring-2 ring-white"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors
                        ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>

            {/* Collapse button - desktop only */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-50 border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm"
            >
                {isMobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40
                    flex flex-col bg-slate-50 border-r border-slate-100
                    transition-all duration-300 ease-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'w-16' : 'w-64'}
                `}
            >
                <NavContent />
            </aside>
        </>
    );
};


