import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentsByTeacher, getAllStudents } from '../../data/data';
import { Calendar, Plus, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export const CreateTask = () => {
    const { user, addTask } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        category: '',
    });

    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
        return null;
    }

    const availableStudents = user.role === 'admin'
        ? getAllStudents()
        : getStudentsByTeacher(user.id);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        addTask({
            title: formData.title,
            description: formData.description,
            assignedTo: formData.assignedTo,
            assignedBy: user.id,
            dueDate: formData.dueDate,
            category: formData.category,
            status: 'open',
        });

        setSuccess(true);
        setTimeout(() => {
            navigate('/tasks');
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    if (success) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Task Created!</h2>
                    <p className="text-slate-600">Redirecting to Tasks list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
            </button>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-violet-600" />
                        <h1 className="text-2xl font-bold text-slate-900">Create New Task</h1>
                    </div>
                    <p className="text-slate-600">Assign a new test, quiz, or exam to a student</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Task Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Mathematics Mid-Term Exam"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Instructions
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the Task, duration, number of questions, topics covered..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Two column grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Assign To */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Assign To
                            </label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="">Select a student</option>
                                {availableStudents.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Due Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>



                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

