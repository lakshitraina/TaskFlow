import React from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

const AnalyticsSummary = () => {
    const { tasks } = useTasks();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && !t.completed).length;

    let headline = "Great start! Keep the momentum going.";
    let subline = "You're steadily checking off tasks.";
    let icon = <Target className="w-10 h-10 text-pw-gold" />;

    if (completionRate >= 80) {
        headline = "Incredible productivity!";
        subline = "You're crushing your goals this week.";
        icon = <TrendingUp className="w-10 h-10 text-pw-green" />;
    } else if (highPriorityTasks > 3) {
        headline = "Action needed on priorities.";
        subline = `You have ${highPriorityTasks} high-priority tasks requiring your attention.`;
        icon = <AlertCircle className="w-10 h-10 text-pw-red" />;
    }

    return (
        <div className="bg-pw-card rounded-[32px] p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-pw-border/60 flex items-center justify-between gap-6 overflow-hidden relative">

            {/* Background design elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-pw-pill-bg rounded-full opacity-50 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
                <div className="bg-[#fbfeff] p-4 rounded-3xl border border-pw-border shadow-sm">
                    {icon}
                </div>
                <div>
                    <h2 className="text-[24px] font-black text-pw-text tracking-tight leading-tight">{headline}</h2>
                    <p className="text-[15px] text-pw-muted mt-1 font-medium">{subline}</p>
                </div>
            </div>

            <div className="hidden md:flex items-end gap-3 relative z-10">
                <div className="text-right">
                    <p className="text-[13px] font-bold text-pw-muted uppercase tracking-wider mb-1">Completion Rate</p>
                    <div className="flex items-baseline justify-end gap-1">
                        <span className="text-4xl font-black text-zinc-900 tracking-tighter">{completionRate}</span>
                        <span className="text-lg font-bold text-pw-muted">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSummary;
