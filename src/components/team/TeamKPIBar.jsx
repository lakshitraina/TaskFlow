import React from 'react';
import { Users, CheckCircle2, ListTodo } from 'lucide-react';
import { useTeam } from '../../context/TeamContext';
import { useTasks } from '../../context/TaskContext';

const TeamKPIBar = () => {
    const { members } = useTeam();
    const { tasks } = useTasks();

    const totalMembers = members.length;

    // Calculate tasks assigned to specific team members
    const assignedTasks = tasks.filter(t => t.assignee && t.assignee !== 'Unassigned');
    const totalAssigned = assignedTasks.length;

    // Calculate team completion rate based ONLY on assigned tasks
    const completedAssigned = assignedTasks.filter(t => t.completed).length;
    const teamCompletionRate = totalAssigned > 0
        ? Math.round((completedAssigned / totalAssigned) * 100)
        : 0;

    const metrics = [
        {
            label: 'Total Members',
            value: totalMembers,
            icon: Users,
            colorClass: 'text-pw-blue',
            bgClass: 'bg-pw-blue/10'
        },
        {
            label: 'Assigned Tasks',
            value: totalAssigned,
            icon: ListTodo,
            colorClass: 'text-pw-gold',
            bgClass: 'bg-pw-gold/10'
        },
        {
            label: 'Team Completion',
            value: `${teamCompletionRate}%`,
            icon: CheckCircle2,
            colorClass: 'text-pw-green',
            bgClass: 'bg-pw-green/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-pw-border shadow-sm flex items-center gap-5 relative overflow-hidden group">

                        <div className={`p-4 rounded-2xl ${metric.bgClass} flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-300`}>
                            <Icon className={`w-7 h-7 ${metric.colorClass}`} strokeWidth={2.5} />
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-[13px] font-bold text-pw-muted tracking-wider uppercase mb-1">{metric.label}</h4>
                            <p className="text-[28px] font-black tracking-tight text-pw-text leading-none">{metric.value}</p>
                        </div>

                        {/* Decorative Background Icon */}
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] transition-transform group-hover:scale-110 duration-500">
                            <Icon className={`w-32 h-32 ${metric.colorClass}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TeamKPIBar;
