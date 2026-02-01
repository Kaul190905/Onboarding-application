import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PollCard } from '../components/polls/PollCard';
import { CreatePollModal } from '../components/polls/CreatePollModal';
import { Vote, Plus } from 'lucide-react';

export const Polls = () => {
    const { user, users, getPollsForUser } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

    if (!user) return null;

    const polls = getPollsForUser();
    const canCreate = user.role === 'admin' || user.role === 'teacher';

    const filteredPolls = polls.filter(poll => {
        if (filter === 'all') return true;
        return poll.status === filter;
    });

    const sortedPolls = [...filteredPolls].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const getCreatorName = (creatorId: string) => {
        const creator = users.find(u => u.id === creatorId);
        return creator?.name || 'Unknown';
    };

    const activeCount = polls.filter(p => p.status === 'active').length;
    const closedCount = polls.filter(p => p.status === 'closed').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center">
                            <Vote className="w-7 h-7 text-violet-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Polls</h1>
                            <p className="text-slate-600">
                                {user.role === 'student'
                                    ? 'Vote on active polls from your teachers and administration'
                                    : 'Create and manage polls for your students'
                                }
                            </p>
                        </div>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Create Poll
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <p className="text-2xl font-bold text-slate-900">{polls.length}</p>
                    <p className="text-sm text-slate-500">Total Polls</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                    <p className="text-sm text-slate-500">Active</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    <p className="text-2xl font-bold text-slate-900">{closedCount}</p>
                    <p className="text-sm text-slate-500">Closed</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-slate-50 text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    All ({polls.length})
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'active'
                        ? 'bg-slate-50 text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Active ({activeCount})
                </button>
                <button
                    onClick={() => setFilter('closed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'closed'
                        ? 'bg-slate-50 text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Closed ({closedCount})
                </button>
            </div>

            {/* Polls Grid */}
            {sortedPolls.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    {sortedPolls.map(poll => (
                        <PollCard
                            key={poll.id}
                            poll={poll}
                            creatorName={getCreatorName(poll.createdBy)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Vote className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No polls yet</h3>
                    <p className="text-slate-500 mb-6">
                        {canCreate
                            ? 'Create your first poll to gather feedback from students.'
                            : 'No polls available at the moment. Check back later!'
                        }
                    </p>
                    {canCreate && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Create Poll
                        </button>
                    )}
                </div>
            )}

            {/* Create Modal */}
            <CreatePollModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};
