
import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Play, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';

const TodaysFocus = () => {
    const { tasks } = useTasks();
    const navigate = useNavigate();

    const focusTask = useMemo(() => {
        const activeTasks = tasks.filter(t => !t.completed);

        // Priority order: Overdue High > Overdue Medium > Due Today High > Due Today Medium > High Priority > Medium Priority
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return activeTasks.sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);

            const isOverdueA = dateA < today;
            const isOverdueB = dateB < today;

            if (isOverdueA && !isOverdueB) return -1;
            if (!isOverdueA && isOverdueB) return 1;

            const priorityWeight = { High: 3, Medium: 2, Low: 1 };
            if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
                return priorityWeight[b.priority] - priorityWeight[a.priority];
            }

            return dateA - dateB;
        })[0];
    }, [tasks]);

    if (!focusTask) return null;

    return (
        <Card className="p-8 bg-pw-card rounded-[32px] text-pw-text border border-pw-border/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-8 overflow-hidden relative group hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
            <div className="flex flex-col items-start gap-6 relative z-10 w-full">
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-pw-pill-bg text-[11px] font-bold text-pw-muted uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-pw-green rounded-full animate-pulse" />
                            Today's Focus
                        </span>
                        {focusTask.priority === 'High' && (
                            <span className="flex items-center text-[11px] bg-[#fdeeee] text-pw-red px-3 py-1 rounded-full uppercase tracking-widest font-bold shrink-0">
                                <AlertCircle className="w-3 h-3 mr-1" strokeWidth={2.5} /> High Priority
                            </span>
                        )}
                    </div>

                    <h2 className="text-[28px] font-bold mb-2 tracking-tight text-zinc-900 leading-tight break-words">{focusTask.title}</h2>
                    {focusTask.description && (
                        <p className="text-pw-muted text-[15px] line-clamp-2 max-w-full font-medium">
                            {focusTask.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-5 text-[13px] font-mono tracking-wide text-pw-muted flex-wrap">
                        {focusTask.dueDate && (
                            <span className="flex items-center gap-2 bg-pw-pill-bg px-3 py-1.5 rounded-lg shrink-0">
                                <Calendar className="w-4 h-4 text-pw-blue" />
                                {new Date(focusTask.dueDate).toLocaleDateString()}
                            </span>
                        )}
                        <span className="flex items-center gap-2 bg-pw-pill-bg px-3 py-1.5 rounded-lg shrink-0">
                            <TrendingUp className="w-4 h-4 text-pw-green" />
                            To Do
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 bg-pw-pill-bg p-5 rounded-3xl border border-pw-border/50 w-full">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-pw-muted">Ready to start?</span>
                    <Button
                        onClick={() => navigate(`/dashboard/focus/${focusTask.id}`)}
                        className="w-full bg-pw-green text-white hover:bg-[#0da672] border-none font-bold rounded-2xl transition-all shadow-[0_4px_16px_rgba(14,183,129,0.2)] py-3"
                    >
                        <Play className="w-4 h-4 mr-2" fill="currentColor" />
                        Start Session
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default TodaysFocus;
