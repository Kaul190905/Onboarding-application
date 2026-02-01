import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreatePollModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose }) => {
    const { user, createPoll } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [targetAudience, setTargetAudience] = useState<'students' | 'students-and-staff'>('students');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !user) return null;

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        const validOptions = options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            setError('Please provide at least 2 options');
            return;
        }

        // Create poll
        createPoll({
            title: title.trim(),
            description: description.trim(),
            options: validOptions.map((text, index) => ({
                id: `opt-${Date.now()}-${index}`,
                text: text.trim(),
                votes: []
            })),
            createdBy: user.id,
            createdByRole: user.role as Role,
            targetAudience: user.role === 'admin' ? targetAudience : 'students'
        });

        // Reset and close
        setTitle('');
        setDescription('');
        setOptions(['', '']);
        setTargetAudience('students');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Create New Poll</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Poll Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What would you like to ask?"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more context..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Options *
                        </label>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length < 6 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Option
                            </button>
                        )}
                    </div>

                    {/* Target Audience (Admin only) */}
                    {user.role === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Who can see this poll?
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="targetAudience"
                                        value="students"
                                        checked={targetAudience === 'students'}
                                        onChange={() => setTargetAudience('students')}
                                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="text-slate-700">Students only</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="targetAudience"
                                        value="students-and-staff"
                                        checked={targetAudience === 'students-and-staff'}
                                        onChange={() => setTargetAudience('students-and-staff')}
                                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="text-slate-700">Students and Staff (teachers can view)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            Create Poll
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
