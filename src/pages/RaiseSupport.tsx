import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Attachment, TicketPriority, SupportTicket } from '../types';
import {
    LifeBuoy,
    Plus,
    X,
    Upload,
    Link2,
    FileText,
    Image as ImageIcon,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Clock,
    Circle,
    ChevronDown,
    ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
    'Technical Issue',
    'Login Problem',
    'Task Related',
    'Upload Error',
    'Feature Request',
    'Other',
];

export const RaiseSupport = () => {
    const { user, getTicketsByUser, submitTicket } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [priority, setPriority] = useState<TicketPriority>('medium');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [linkInput, setLinkInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user || user.role === 'admin') {
        return null;
    }

    const myTickets = getTicketsByUser(user.id);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Limit file size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const newAttachment: Attachment = {
                    id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: 'file',
                    url: reader.result as string,
                    mimeType: file.type,
                };
                setAttachments(prev => [...prev, newAttachment]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddLink = () => {
        if (!linkInput.trim()) return;

        // Basic URL validation
        let url = linkInput.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newAttachment: Attachment = {
            id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: url,
            type: 'link',
            url: url,
        };
        setAttachments(prev => [...prev, newAttachment]);
        setLinkInput('');
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory(CATEGORIES[0]);
        setPriority('medium');
        setAttachments([]);
        setLinkInput('');
        setError('');
        setSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        submitTicket({
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            submittedBy: user.id,
            attachments,
        });

        setSuccess(true);
        setTimeout(() => {
            resetForm();
            setShowForm(false);
        }, 2000);
    };

    const getStatusIcon = (status: SupportTicket['status']) => {
        switch (status) {
            case 'open':
                return <Circle className="w-4 h-4 text-amber-500" />;
            case 'in-progress':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'resolved':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        }
    };

    const getStatusColor = (status: SupportTicket['status']) => {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LifeBuoy className="w-6 h-6 text-violet-600" />
                            <h1 className="text-xl font-bold text-slate-900">Support</h1>
                        </div>
                        <p className="text-slate-600">
                            Report issues, request help, or provide feedback to the admin team.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Raise New Ticket
                    </button>
                </div>
            </div>

            {/* New Ticket Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !success && setShowForm(false)} />
                    <div className="relative bg-slate-50 rounded-2xl border border-slate-100 shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900">Raise Support Ticket</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Brief summary of your issue"
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 pr-10 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                                    <div className="flex gap-2">
                                        {(['low', 'medium', 'high'] as TicketPriority[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`flex-1 px-3 py-3 rounded-xl border-2 font-medium text-sm capitalize transition-all ${priority === p
                                                        ? p === 'low' ? 'border-slate-400 bg-slate-100 text-slate-700'
                                                            : p === 'medium' ? 'border-amber-400 bg-amber-50 text-amber-700'
                                                                : 'border-red-400 bg-red-50 text-red-700'
                                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your issue in detail. Include steps to reproduce if applicable."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Attachments */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Attachments <span className="text-slate-400">(optional)</span>
                                </label>

                                <div className="flex gap-3 mb-3">
                                    {/* File Upload */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-200 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Files
                                    </button>

                                    {/* Link Input */}
                                    <div className="flex-1 flex gap-2">
                                        <div className="flex-1 relative">
                                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={linkInput}
                                                onChange={(e) => setLinkInput(e.target.value)}
                                                placeholder="Paste a link..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddLink}
                                            disabled={!linkInput.trim()}
                                            className="px-4 py-2.5 bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Attachment List */}
                                {attachments.length > 0 && (
                                    <div className="space-y-2 p-3 bg-slate-100 rounded-xl">
                                        {attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                                            >
                                                {attachment.type === 'link' ? (
                                                    <Link2 className="w-4 h-4 text-blue-500" />
                                                ) : attachment.mimeType?.startsWith('image/') ? (
                                                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-violet-500" />
                                                )}
                                                <span className="flex-1 text-sm text-slate-700 truncate">
                                                    {attachment.name}
                                                </span>
                                                {attachment.type === 'link' && (
                                                    <a
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-slate-400 hover:text-blue-500"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(attachment.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <span>Ticket submitted successfully! Redirecting...</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={success}
                                className={`w-full py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors ${success ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Submit Ticket
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* My Tickets */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">My Tickets</h2>
                </div>

                {myTickets.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {myTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ticket) => (
                            <div key={ticket.id} className="p-4 hover:bg-slate-100/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusIcon(ticket.status)}
                                            <h3 className="font-medium text-slate-900 truncate">{ticket.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">{ticket.description}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('-', ' ')}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                            {ticket.attachments.length > 0 && (
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    {ticket.attachments.length} attachment{ticket.attachments.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                        {ticket.adminNotes && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                                                <span className="font-medium">Admin response:</span> {ticket.adminNotes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LifeBuoy className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No tickets yet</h3>
                        <p className="text-slate-500 mb-4">You haven't submitted any support tickets.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Raise Your First Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
