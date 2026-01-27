import type { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    title?: string;
    showAssignee?: boolean;
    showActions?: boolean;
    emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    title,
    showAssignee = false,
    showActions = false,
    emptyMessage = 'No tasks to display',
}) => {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6" />
                </div>
                <p className="text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div>
            {title && (
                <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            )}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        showAssignee={showAssignee}
                        showActions={showActions}
                    />
                ))}
            </div>
        </div>
    );
};


