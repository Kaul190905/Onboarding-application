import { useState } from 'react';
import type { Poll } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, Users, ChevronDown, ChevronUp, XCircle } from 'lucide-react';

interface PollCardProps {
    poll: Poll;
    creatorName?: string;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, creatorName }) => {
    const { user, votePoll, closePoll } = useAuth();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(
        user ? poll.options.some(opt => opt.votes.includes(user.id)) : false
    );

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
    const isCreator = user?.id === poll.createdBy;
    const canVote = user?.role === 'student' && poll.status === 'active' && !hasVoted;
    const showResults = hasVoted || poll.status === 'closed' || user?.role !== 'student';

    const handleVote = () => {
        if (!selectedOption || !user) return;

        const result = votePoll(poll.id, selectedOption, user.id);
        if (result.success) {
            setHasVoted(true);
            setError(null);
        } else {
            setError(result.error || 'Failed to vote');
        }
    };

    const handleClose = () => {
        closePoll(poll.id);
    };

    const getVotedOption = () => {
        if (!user) return null;
        return poll.options.find(opt => opt.votes.includes(user.id));
    };

    return (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${poll.status === 'active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                            {poll.status === 'active' ? (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> Closed
                                </span>
                            )}
                        </span>
                        {poll.createdByRole === 'admin' && (
                            <span className="px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700">
                                Admin Poll
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{poll.title}</h3>
                    {poll.description && (
                        <p className="text-slate-600 text-sm mt-1">{poll.description}</p>
                    )}
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
            </div>

            {/* Creator info */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Users className="w-4 h-4" />
                <span>Created by {creatorName || 'Unknown'}</span>
                <span className="text-slate-300">•</span>
                <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
            </div>

            {/* Options */}
            <div className={`space-y-3 ${isExpanded ? '' : 'max-h-48 overflow-hidden'}`}>
                {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                    const isSelected = selectedOption === option.id;
                    const isVotedOption = user && option.votes.includes(user.id);

                    return (
                        <div key={option.id} className="relative">
                            {canVote ? (
                                <button
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-violet-500 bg-violet-50'
                                            : 'border-slate-200 hover:border-violet-300 bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-slate-700">{option.text}</span>
                                        {isSelected && <CheckCircle2 className="w-5 h-5 text-violet-500" />}
                                    </div>
                                </button>
                            ) : (
                                <div className={`p-4 rounded-xl border-2 ${isVotedOption ? 'border-violet-300 bg-violet-50' : 'border-slate-200 bg-slate-50'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${isVotedOption ? 'text-violet-700' : 'text-slate-700'}`}>
                                            {option.text}
                                        </span>
                                        <span className="text-sm font-bold text-slate-600">{percentage}%</span>
                                    </div>
                                    {showResults && (
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isVotedOption ? 'bg-violet-500' : 'bg-slate-400'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Error message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Vote success */}
            {hasVoted && user?.role === 'student' && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    You voted for: {getVotedOption()?.text}
                </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
                {canVote && selectedOption && (
                    <button
                        onClick={handleVote}
                        className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                    >
                        Submit Vote
                    </button>
                )}
                {isCreator && poll.status === 'active' && (
                    <button
                        onClick={handleClose}
                        className="px-4 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                    >
                        Close Poll
                    </button>
                )}
            </div>
        </div>
    );
};
