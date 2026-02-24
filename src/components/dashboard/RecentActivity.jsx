
import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle, PlusCircle, Trash2, Edit } from 'lucide-react';

const RecentActivity = () => {
    const { activityLog } = useTasks();

    const getIcon = (action) => {
        switch (action) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'created':
                return <PlusCircle className="w-5 h-5 text-blue-500" />;
            case 'deleted':
                return <Trash2 className="w-5 h-5 text-red-500" />;
            case 'updated':
            case 'uncompleted':
                return <Edit className="w-5 h-5 text-yellow-500" />;
            default:
                return <Edit className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activityLog.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity.</p>
                ) : (
                    activityLog.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="mt-0.5">{getIcon(activity.action)}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    <span className="capitalize">{activity.action}</span>: {activity.taskTitle}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(activity.timestamp).toLocaleDateString()} at {formatTime(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
