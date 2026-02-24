import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useTeam } from '../../context/TeamContext';
import { Search, Filter, Calendar as CalendarIcon, ChevronDown, ChevronRight, CheckSquare, Play, User, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import SubtaskList from './SubtaskList';

const PriorityBadge = ({ priority }) => {
    const colors = {
        High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
            {priority}
        </span>
    );
};

const CategoryBadge = ({ category }) => {
    return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            {category || 'Work'}
        </span>
    );
};

const TaskList = ({ onEdit }) => {
    const { tasks, deleteTask, toggleTaskCompletion } = useTasks();
    const { members } = useTeam();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [filterMember, setFilterMember] = useState('all'); // all, or memberId
    const [sortBy, setSortBy] = useState('date'); // date, priority
    const [expandedTasks, setExpandedTasks] = useState({});

    const toggleExpand = (taskId) => {
        setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const filteredTasks = useMemo(() => {
        return tasks
            .filter((task) => {
                const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
                const matchesFilter =
                    filter === 'all' ? true :
                        filter === 'completed' ? task.completed :
                            !task.completed;
                const matchesMember = filterMember === 'all' ? true : task.assignedTo === filterMember;
                return matchesSearch && matchesFilter && matchesMember;
            })
            .sort((a, b) => {
                if (sortBy === 'priority') {
                    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [tasks, search, filter, sortBy]);

    return (
        <div className="bg-pw-card rounded-[32px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-pw-border/50 flex flex-col h-full overflow-hidden relative">
            <div className="p-6 border-b border-pw-border flex flex-col lg:flex-row gap-4 justify-between items-center bg-pw-bg/30">
                <h2 className="text-[20px] font-bold text-pw-text flex items-center gap-2 tracking-tight">
                    <ListTodo className="w-5 h-5 text-pw-blue" strokeWidth={2.5} />
                    Current Tasks
                </h2>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={filterMember}
                        onChange={(e) => setFilterMember(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Members</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="date">Date</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>

            <div className="divide-y divide-pw-border bg-white flex-1">
                {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center text-pw-muted font-medium">
                        No tasks found matching your criteria.
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
                        const totalSubtasks = task.subtasks?.length || 0;


                        return (
                            <div key={task.id} className="p-5 hover:bg-pw-pill-bg transition-colors group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <button
                                                onClick={() => toggleExpand(task.id)}
                                                className="text-pw-muted hover:text-pw-text p-1"
                                            >
                                                {expandedTasks[task.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTaskCompletion(task.id)}
                                                className="h-5 w-5 rounded-[6px] border-pw-border text-pw-green focus:ring-pw-green cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 mr-4">
                                            <h4 className={`text-[16px] font-bold text-pw-text tracking-tight ${task.completed ? 'line-through text-pw-muted' : ''}`}>
                                                {task.title}
                                            </h4>
                                            {task.description && (
                                                <p className="text-[13px] text-pw-muted line-clamp-1 mt-1 font-medium">{task.description}</p>
                                            )}

                                            {totalSubtasks > 0 && (
                                                <div className="mt-2 w-full max-w-xs">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                        <span>Progress</span>
                                                        <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.round((completedSubtasks / totalSubtasks) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 items-center">
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                                                </span>
                                                <PriorityBadge priority={task.priority} />
                                                <CategoryBadge category={task.category} />
                                                {totalSubtasks > 0 && (
                                                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                        <CheckSquare className="h-3 w-3" />
                                                        {completedSubtasks}/{totalSubtasks}
                                                    </span>
                                                )}
                                                {task.focusTime > 0 && (
                                                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                                                        {Math.round(task.focusTime / 60)}m focused
                                                    </span>
                                                )}
                                                {task.assignedToName && (
                                                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                                        {task.assignedToAvatar ? (
                                                            <img
                                                                src={task.assignedToAvatar}
                                                                alt={task.assignedToName}
                                                                className="w-4 h-4 rounded-full"
                                                            />
                                                        ) : (
                                                            <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                        )}
                                                        <span className="text-gray-600 dark:text-gray-300 font-medium">{task.assignedToName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!task.completed && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => navigate(`/dashboard/focus/${task.id}`)}
                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                            >
                                                <Play className="h-3 w-3 mr-1" />
                                                Focus
                                            </Button>
                                        )}
                                        <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => deleteTask(task.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {expandedTasks[task.id] && (
                                    <SubtaskList taskId={task.id} subtasks={task.subtasks} />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TaskList;
