
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';

const QuickAddTask = () => {
    const { addTask } = useTasks();
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title: title.trim(),
            description: '',
            priority: 'Medium',
            dueDate: '',
        });
        setTitle('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Add Task</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title..."
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
                <Button type="submit" size="sm">
                    <Plus className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
};

export default QuickAddTask;
