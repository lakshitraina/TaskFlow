
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { Play, Pause, RotateCcw, X, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const FocusMode = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { tasks, logFocusTime, toggleTaskCompletion } = useTasks();
    const task = tasks.find(t => t.id === taskId);

    const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    // Track time spent in current active session to log it
    // We log periodically or on pause/stop to be safe, but let's log on completion or manual stop
    const startTimeRef = useRef(null);

    const modes = {
        focus: { label: 'Focus', minutes: 25, color: 'text-blue-500' },
        shortBreak: { label: 'Short Break', minutes: 5, color: 'text-green-500' },
        longBreak: { label: 'Long Break', minutes: 15, color: 'text-purple-500' }
    };

    useEffect(() => {
        if (!task) {
            toast.error('Task not found');
            navigate('/dashboard');
        }
    }, [task, navigate]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'focus') {
                toast.success('Focus session completed!');
                logFocusTime(taskId, modes.focus.minutes * 60);
                setSessionCount(c => c + 1);
            } else {
                toast.success('Break over! Back to work.');
            }
            // Play notification sound here if we had one
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, taskId, logFocusTime, modes.focus.minutes]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].minutes * 60);
    };

    const switchMode = (newMode) => {
        if (isActive && mode === 'focus') {
            // Log partial time if switching away from focus while active?
            // For simplicity, let's just warn or reset.
            // Let's just reset.
        }
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(modes[newMode].minutes * 60);
    };

    const handleExit = () => {
        if (isActive && mode === 'focus') {
            const confirmed = window.confirm('Timer is running. Exit and discard current session progress?');
            if (!confirmed) return;
        }
        navigate('/dashboard');
    };

    const handleCompleteTask = () => {
        toggleTaskCompletion(taskId);
        toast.success('Task completed! Great job.');
        navigate('/dashboard');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!task) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative">
            <button
                onClick={handleExit}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Exit Focus Mode"
            >
                <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="max-w-md w-full text-center space-y-8">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-800 text-sm font-medium text-gray-400 mb-4">
                        {modes[mode].label}
                    </span>
                    <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                    <p className="text-gray-400">
                        {sessionCount > 0 ? `${sessionCount} sessions completed` : 'Stay focused, you got this!'}
                    </p>
                </div>

                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    {/* Simple circular progress visualization could go here */}
                    <div className={`text-6xl font-mono font-bold tracking-wider ${modes[mode].color}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${isActive
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <RotateCcw className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex justify-center gap-2">
                    {Object.keys(modes).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m
                                    ? 'bg-gray-800 text-white border border-gray-700'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {modes[m].label}
                        </button>
                    ))}
                </div>

                <div className="pt-8 mt-8 border-t border-gray-800">
                    <Button
                        variant="ghost"
                        onClick={handleCompleteTask}
                        className="w-full text-green-500 hover:bg-gray-800 hover:text-green-400"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark Task as Completed
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
