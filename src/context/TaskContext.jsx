import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const [activityLog, setActivityLog] = useState([]);

    const categories = ['Work', 'Personal', 'Health', 'Learning', 'Finance'];

    // Fetch tasks and activities from backend on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, activitiesRes] = await Promise.all([
                    fetch('/api/tasks'),
                    fetch('/api/activities')
                ]);

                if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
                if (!activitiesRes.ok) throw new Error('Failed to fetch activities');

                const tasksData = await tasksRes.json();
                const activitiesData = await activitiesRes.json();

                setTasks(Array.isArray(tasksData) ? tasksData : []);
                setActivityLog(Array.isArray(activitiesData) ? activitiesData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data from server');
            }
        };
        fetchData();
    }, []);


    const logActivity = async (action, taskTitle) => {
        const newActivity = { action, taskTitle };

        // Optimistic UI update
        const tempId = uuidv4();
        setActivityLog((prev) => [{ ...newActivity, id: tempId, timestamp: new Date().toISOString() }, ...prev].slice(0, 1000));

        try {
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity),
            });
            if (!res.ok) throw new Error('Failed to save activity');

            // Replace the optimistic entry with the real one from DB (which has the correct MongoDB _id)
            const savedActivity = await res.json();
            setActivityLog(prev => prev.map(act => act.id === tempId ? savedActivity : act));
        } catch (error) {
            console.error('Error saving activity:', error);
            // We could revert the optimistic update here if needed
        }
    };

    const addTask = async (task) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            if (!response.ok) throw new Error('Failed to add task');
            const newTask = await response.json();

            setTasks((prev) => [newTask, ...prev]);
            logActivity('created', newTask.title);
            toast.success('Task added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add task');
        }
    };

    const updateTask = async (id, updatedFields) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
            );

            const action = updatedFields.completed ? 'completed' : 'updated';
            logActivity(action, updatedTask.title);
            toast.success('Task updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update task');
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');

            const task = tasks.find((t) => t.id === id);
            if (task) logActivity('deleted', task.title);

            setTasks((prev) => prev.filter((task) => task.id !== id));
            toast.success('Task deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete task');
        }
    };

    const toggleTaskCompletion = async (id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        const newCompletedStatus = !task.completed;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: newCompletedStatus }),
            });
            if (!response.ok) throw new Error('Failed to toggle task');
            const updatedTask = await response.json();

            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
            );
            logActivity(newCompletedStatus ? 'completed' : 'uncompleted', updatedTask.title);
        } catch (error) {
            console.error(error);
            toast.error('Failed to toggle completion');
        }
    };

    const addSubtask = async (taskId, title) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedSubtasks = [...(task.subtasks || []), { title, completed: false }];
        await updateTask(taskId, { subtasks: updatedSubtasks });
    };

    const toggleSubtask = async (taskId, subtaskId) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId || sub._id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        const allSubtasksComplete = updatedSubtasks.every(sub => sub.completed);
        const taskCompleted = allSubtasksComplete && updatedSubtasks.length > 0 ? true : task.completed;

        await updateTask(taskId, { subtasks: updatedSubtasks, completed: taskCompleted });
    };

    const deleteSubtask = async (taskId, subtaskId) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const updatedSubtasks = task.subtasks.filter((sub) => sub.id !== subtaskId && sub._id !== subtaskId);
        await updateTask(taskId, { subtasks: updatedSubtasks });
    };

    const clearCompleted = async () => {
        try {
            const completedTasks = tasks.filter(t => t.completed);
            if (completedTasks.length === 0) return;

            // Delete each one sequentially or via Promise.all
            await Promise.all(completedTasks.map(t => fetch(`/api/tasks/${t.id}`, { method: 'DELETE' })));

            logActivity('cleared', `${completedTasks.length} completed tasks`);
            setTasks((prev) => prev.filter((task) => !task.completed));
            toast.success('Completed tasks cleared');
        } catch (error) {
            console.error(error);
            toast.error('Failed to clear completed tasks');
        }
    };

    const logFocusTime = async (taskId, durationSeconds) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedFocusTime = (task.focusTime || 0) + durationSeconds;

        // Optimistic UI update
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, focusTime: updatedFocusTime } : t))
        );
        logActivity('focus_session', `${Math.round(durationSeconds / 60)}m on ${task.title}`);

        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ focusTime: updatedFocusTime }),
            });
        } catch (error) {
            console.error('Failed to log focus time to backend', error);
        }
    };

    const reorderTasks = (newTasksOrder) => {
        setTasks(newTasksOrder);
        // We aren't doing backend persisting of manual order changes for now 
        // as it requires a specific schema field (`orderIndex`).
    };

    const clearActivityLog = async () => {
        try {
            const res = await fetch('/api/activities', { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to clear activity log');
            setActivityLog([]);
            toast.success('Activity history cleared');
        } catch (error) {
            console.error('Error clearing activities:', error);
            toast.error('Failed to clear activity log');
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                deleteTask,
                toggleTaskCompletion,
                addSubtask,
                toggleSubtask,
                deleteSubtask,
                reorderTasks,
                logFocusTime,
                clearCompleted,
                setTasks,
                activityLog,
                clearActivityLog,
                categories
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
