import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TicketDetailModal } from '../components/support/TicketDetailModal';
import type { SupportTicket, TicketStatus, TicketPriority } from '../types';
import {
    Inbox,
    Search,
    Clock,
    CheckCircle2,
    Circle,
    ChevronDown,
    AlertTriangle,
    FileText,
    Eye,
} from 'lucide-react';

export const SupportTickets = () => {
    const { user, users, tickets } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    if (!user || user.role !== 'admin') {
        return null;
    }

    const filteredTickets = tickets.filter(ticket => {
        if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
        if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const submitter = users.find(u => u.id === ticket.submittedBy);
            return (
                ticket.title.toLowerCase().includes(search) ||
                ticket.description.toLowerCase().includes(search) ||
                submitter?.name.toLowerCase().includes(search) ||
                submitter?.email.toLowerCase().includes(search)
            );
        }
        return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getStatusIcon = (status: TicketStatus) => {
        switch (status) {
            case 'open':
                return <Circle className="w-4 h-4 text-amber-500" />;
            case 'in-progress':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'resolved':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        }
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'open':
                return 'bg-amber-50 text-amber-700';
            case 'in-progress':
                return 'bg-blue-50 text-blue-700';
            case 'resolved':
                return 'bg-emerald-50 text-emerald-700';
        }
    };

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case 'low':
                return 'bg-slate-100 text-slate-600';
            case 'medium':
                return 'bg-amber-50 text-amber-700';
            case 'high':
                return 'bg-red-50 text-red-700';
        }
    };

    const getSubmitterInfo = (submittedBy: string) => {
        const submitter = users.find(u => u.id === submittedBy);
        return submitter || { name: 'Unknown', email: '', avatar: '', role: 'student' };
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Inbox className="w-6 h-6 text-violet-600" />
                    <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
                </div>
                <p className="text-slate-600">
                    View and manage support requests from students and teachers.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
                    <p className="text-sm text-slate-500">Total Tickets</p>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700">{stats.open}</p>
                    <p className="text-sm text-amber-600">Open</p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
                    <p className="text-sm text-blue-600">In Progress</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{stats.resolved}</p>
                    <p className="text-sm text-emerald-600">Resolved</p>
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
                            placeholder="Search tickets by title, description, or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
                            className="appearance-none px-4 py-2.5 pr-10 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    {/* Priority Filter */}
                    <div className="relative">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value as TicketPriority | 'all')}
                            className="appearance-none px-4 py-2.5 pr-10 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                {filteredTickets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Ticket</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Submitted By</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Priority</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => {
                                    const submitter = getSubmitterInfo(ticket.submittedBy);
                                    return (
                                        <tr
                                            key={ticket.id}
                                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-100/50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(ticket.status)}
                                                    <div>
                                                        <p className="font-medium text-slate-900 truncate max-w-[200px]">{ticket.title}</p>
                                                        {ticket.attachments.length > 0 && (
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <FileText className="w-3 h-3" />
                                                                {ticket.attachments.length} attachment{ticket.attachments.length !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={submitter.avatar}
                                                        alt={submitter.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{submitter.name}</p>
                                                        <p className="text-xs text-slate-500 capitalize">{submitter.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{ticket.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority === 'high' && <AlertTriangle className="w-3 h-3" />}
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTicket(ticket);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No tickets found</h3>
                        <p className="text-slate-500">
                            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                                ? 'Try adjusting your filters.'
                                : 'No support tickets have been submitted yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <TicketDetailModal
                    ticket={selectedTicket}
                    isOpen={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};
