
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import Button from '../ui/Button';

const SubtaskList = ({ taskId, subtasks = [] }) => {
    const { addSubtask, toggleSubtask, deleteSubtask } = useTasks();
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        addSubtask(taskId, newSubtaskTitle.trim());
        setNewSubtaskTitle('');
    };

    return (
        <div className="mt-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
            <div className="space-y-2 mb-3">
                {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 group">
                        <button
                            onClick={() => toggleSubtask(taskId, subtask.id)}
                            className={`flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors ${subtask.completed ? 'text-blue-500' : ''}`}
                        >
                            {subtask.completed ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <span className={`flex-1 text-sm text-gray-700 dark:text-gray-300 ${subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                            {subtask.title}
                        </span>
                        <button
                            onClick={() => deleteSubtask(taskId, subtask.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <Button type="submit" size="sm" variant="secondary" className="px-2">
                    <Plus className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
};

export default SubtaskList;
