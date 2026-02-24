
import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Calendar, AlertCircle } from 'lucide-react';

const UpcomingDeadlines = () => {
    const { tasks } = useTasks();

    const getUpcomingTasks = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next3Days = new Date(today);
        next3Days.setDate(today.getDate() + 3);

        return tasks
            .filter(task => {
                if (!task.dueDate || task.completed) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate >= today && dueDate <= next3Days;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    };

    const upcomingTasks = getUpcomingTasks();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming deadlines.</p>
                ) : (
                    upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {task.title}
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UpcomingDeadlines;
