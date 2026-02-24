import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

const SummaryCard = ({ title, value, label, icon: Icon, colorClass, textClass }) => (
    <div className="bg-pw-card p-6 rounded-[32px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-pw-border/50 relative overflow-hidden group hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${colorClass}`}>
                <Icon className={`h-5 w-5 ${textClass}`} strokeWidth={2.5} />
            </div>
            {label && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${textClass} opacity-80 pt-1`}>
                    {label}
                </span>
            )}
        </div>
        <div>
            <p className="text-[11px] font-bold text-pw-muted uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-[32px] font-bold leading-none tracking-tight ${textClass}`}>{value}</h3>
        </div>
    </div>
);

const SummaryCards = () => {
    const { tasks } = useTasks();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && !t.completed).length;

    // Calculate a mock "Focus Score" based on completion rate for the 6th card
    const focusScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 850) : 0;
    const scoreLabel = focusScore > 700 ? "EXCELLENT" : focusScore > 500 ? "GOOD" : "NEEDS WORK";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
                title="Total Tasks"
                value={totalTasks}
                label="ALL TIME"
                icon={ListTodo}
                colorClass="bg-[#f0f2f5]"
                textClass="text-zinc-900"
            />
            <SummaryCard
                title="Completed"
                value={completedTasks}
                label="FINISHED"
                icon={CheckCircle2}
                colorClass="bg-[#e7f8f2]"
                textClass="text-pw-green"
            />
            <SummaryCard
                title="Overdue"
                value={overdueTasks}
                label="NEEDS ATTENTION"
                icon={AlertCircle}
                colorClass="bg-[#fdeeee]"
                textClass="text-pw-red"
            />
            <SummaryCard
                title="In Progress"
                value={pendingTasks}
                label="RUNNING"
                icon={Clock}
                colorClass="bg-[#eef4ff]"
                textClass="text-pw-blue"
            />
        </div>
    );
};

export default SummaryCards;
