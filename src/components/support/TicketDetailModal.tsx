import { useState } from 'react';
import type { SupportTicket, TicketStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
    X,
    Clock,
    CheckCircle2,
    Circle,
    FileText,
    Image as ImageIcon,
    Link2,
    ExternalLink,
    Download,
    ChevronDown,
    User,
    Calendar,
    Tag,
    AlertTriangle,
} from 'lucide-react';

interface TicketDetailModalProps {
    ticket: SupportTicket;
    isOpen: boolean;
    onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, isOpen, onClose }) => {
    const { users, updateTicket } = useAuth();
    const [status, setStatus] = useState<TicketStatus>(ticket.status);
    const [adminNotes, setAdminNotes] = useState(ticket.adminNotes || '');
    const [saved, setSaved] = useState(false);

    const submitter = users.find(u => u.id === ticket.submittedBy);

    const handleSave = () => {
        updateTicket(ticket.id, { status, adminNotes: adminNotes.trim() || undefined });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const getStatusIcon = (s: TicketStatus) => {
        switch (s) {
            case 'open':
                return <Circle className="w-4 h-4" />;
            case 'in-progress':
                return <Clock className="w-4 h-4" />;
            case 'resolved':
                return <CheckCircle2 className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low':
                return 'bg-slate-100 text-slate-600';
            case 'medium':
                return 'bg-amber-50 text-amber-700';
            case 'high':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-50 rounded-2xl border border-slate-100 shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${ticket.priority === 'high' ? 'bg-red-50' :
                                ticket.priority === 'medium' ? 'bg-amber-50' : 'bg-slate-100'
                            }`}>
                            <AlertTriangle className={`w-5 h-5 ${ticket.priority === 'high' ? 'text-red-600' :
                                    ticket.priority === 'medium' ? 'text-amber-600' : 'text-slate-600'
                                }`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{ticket.title}</h2>
                            <p className="text-sm text-slate-500">Ticket #{ticket.id.split('-')[1]}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                <User className="w-3 h-3" />
                                Submitted by
                            </div>
                            <div className="flex items-center gap-2">
                                {submitter && (
                                    <img src={submitter.avatar} alt={submitter.name} className="w-5 h-5 rounded-full" />
                                )}
                                <span className="text-sm font-medium text-slate-900">{submitter?.name || 'Unknown'}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                <Tag className="w-3 h-3" />
                                Category
                            </div>
                            <span className="text-sm font-medium text-slate-900">{ticket.category}</span>
                        </div>
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                <AlertTriangle className="w-3 h-3" />
                                Priority
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                        </div>
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                <Calendar className="w-3 h-3" />
                                Created
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                        <div className="p-4 bg-slate-100 rounded-xl text-slate-700 whitespace-pre-wrap">
                            {ticket.description}
                        </div>
                    </div>

                    {/* Attachments */}
                    {ticket.attachments.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                Attachments ({ticket.attachments.length})
                            </h3>
                            <div className="space-y-3">
                                {ticket.attachments.map((attachment) => (
                                    <div key={attachment.id} className="p-3 bg-slate-100 rounded-xl">
                                        {attachment.type === 'link' ? (
                                            <div className="flex items-center gap-3">
                                                <Link2 className="w-5 h-5 text-blue-500" />
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 text-blue-600 hover:underline truncate"
                                                >
                                                    {attachment.name}
                                                </a>
                                                <ExternalLink className="w-4 h-4 text-slate-400" />
                                            </div>
                                        ) : attachment.mimeType?.startsWith('image/') ? (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-sm text-slate-700">{attachment.name}</span>
                                                </div>
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    className="max-w-full max-h-64 rounded-lg border border-slate-200"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-violet-500" />
                                                <span className="flex-1 text-slate-700 truncate">{attachment.name}</span>
                                                <a
                                                    href={attachment.url}
                                                    download={attachment.name}
                                                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Admin Actions</h3>

                        {/* Status Update */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-600 mb-2">Update Status</label>
                            <div className="relative inline-block">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                                    className="appearance-none pl-10 pr-10 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer"
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    {getStatusIcon(status)}
                                </div>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Response / Notes <span className="text-slate-400">(visible to user)</span>
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add a response or notes for the user..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className={`px-6 py-2.5 font-medium rounded-xl transition-colors ${saved
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-violet-600 text-white hover:bg-violet-700'
                                }`}
                        >
                            {saved ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Saved!
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
