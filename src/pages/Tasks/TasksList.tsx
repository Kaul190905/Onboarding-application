import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TaskList } from '../../components/tasks/TaskList';
import { getTasksByStudent, getTasksByTeacher } from '../../data/data';
import { Search, Filter } from 'lucide-react';

export const TasksList = () => {
    const { user, tasks } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');

    if (!user) return null;

    // Get tasks based on role
    let userTasks = tasks;
    if (user.role === 'student') {
        userTasks = getTasksByStudent(user.id, tasks);
    } else if (user.role === 'teacher') {
        userTasks = getTasksByTeacher(user.id, tasks);
    }

    // Apply filters
    const filteredTasks = userTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusOptions = [
        { value: 'all', label: 'All' },
        { value: 'open', label: 'Not Started' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                            {statusOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setStatusFilter(option.value as typeof statusFilter)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                        ${statusFilter === option.value
                                            ? 'bg-white text-violet-600 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        {statusFilter === 'all' ? 'All Tasks' : statusOptions.find(o => o.value === statusFilter)?.label}
                    </h2>
                    <span className="text-sm text-slate-500">
                        {filteredTasks.length} Task{filteredTasks.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <TaskList
                    tasks={filteredTasks}
                    showAssignee={user.role !== 'student'}
                    showActions={user.role === 'student'}
                />
            </div>
        </div>
    );
};

