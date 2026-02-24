
import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SubtaskList from './SubtaskList';
import { Play, Calendar, Clock, CheckCircle, Trash2, Edit2, History, StickyNote, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TaskDetailsModal = ({ isOpen, onClose, task, onEdit }) => {
    const { toggleTaskCompletion, deleteTask, activityLog } = useTasks();
    const navigate = useNavigate();
    const [notes, setNotes] = useState(task?.notes || '');
    // In a real app, we'd save notes on blur or button click. 
    // For now, let's assume notes are saved via the 'Edit' form or we'd add a 'save notes' function.
    // Actually, let's just display them here for now as part of 'Edit' flow requirements or read-only.
    // The prompt says "Notes section" and "Edit & delete options". 
    // Making it read-only here with an Edit button to change properties is cleaner for now.

    if (!task) return null;

    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    const taskHistory = activityLog.filter(log => log.taskTitle === task.title).slice(0, 5);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <div className="flex items-start justify-between">
                        <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h2>
                        {task.priority === 'High' && (
                            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" /> High
                            </span>
                        )}
                    </div>
                    {task.description && (
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{task.description}</p>
                    )}
                </div>

                {/* Meta Data */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                    </div>
                    {task.focusTime > 0 && (
                        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <Clock className="w-4 h-4" />
                            {Math.round(task.focusTime / 60)}m focused
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {totalSubtasks > 0 && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant={task.completed ? "outline" : "primary"}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="w-full justify-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {task.completed ? 'Mark Incomplete' : 'Complete Task'}
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            navigate(`/dashboard/focus/${task.id}`);
                        }}
                        className="w-full justify-center bg-purple-600 hover:bg-purple-700 text-white border-none"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Start Focus
                    </Button>
                </div>

                {/* Subtasks */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                        Subtasks
                    </h3>
                    <SubtaskList taskId={task.id} subtasks={task.subtasks} />
                </div>

                {/* Notes (Read Only display for now, assuming edit via Edit form) */}
                {task.notes && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1 flex items-center">
                            <StickyNote className="w-4 h-4 mr-2" />
                            Notes
                        </h3>
                        <p className="text-sm text-yellow-800/80 dark:text-yellow-500/80 whitespace-pre-wrap">
                            {task.notes}
                        </p>
                    </div>
                )}

                {/* History */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <History className="w-4 h-4 mr-2 text-gray-400" />
                        Recent History
                    </h3>
                    <div className="space-y-2">
                        {taskHistory.length > 0 ? (
                            taskHistory.map(log => (
                                <div key={log.id} className="text-xs text-gray-500 flex justify-between">
                                    <span>{log.action}</span>
                                    <span>{format(new Date(log.timestamp), 'MMM d, h:mm a')}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">No history yet.</p>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button variant="outline" onClick={() => { onClose(); onEdit(task); }}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Details
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TaskDetailsModal;
