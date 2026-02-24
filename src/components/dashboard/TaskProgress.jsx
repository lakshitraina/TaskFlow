import React from 'react';
import { motion } from 'framer-motion';

const TaskProgress = ({ total, completed }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Progress</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You've completed <span className="font-bold text-blue-600 dark:text-blue-400">{completed}</span> out of <span className="font-bold text-gray-900 dark:text-white">{total}</span> tasks.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    {percentage === 100 ? "All done! Great job! 🎉" : "Keep going!"}
                </p>
            </div>

            <div className="relative h-20 w-20 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="40"
                        cy="40"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        className="text-blue-600 dark:text-blue-500"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference} // Start from 0
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="40"
                        cy="40"
                    />
                </svg>
                <span className="absolute text-sm font-bold text-gray-900 dark:text-white">
                    {percentage}%
                </span>
            </div>
        </div>
    );
};

export default TaskProgress;
