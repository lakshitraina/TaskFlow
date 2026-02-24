
import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../ui/Card';

const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
    <Card className="p-6 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            {subtext && (
                <div className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-green-600' :
                        trend === 'down' ? 'text-red-600' :
                            'text-gray-500'
                    }`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                        trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                            <Minus className="w-3 h-3" />}
                    {subtext}
                </div>
            )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </Card>
);

const StatsCards = () => {
    const { tasks, activityLog } = useTasks();

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        // Calculate completion rate
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Overdue tasks
        const overdue = tasks.filter(t => {
            if (t.completed || !t.dueDate) return false;
            return new Date(t.dueDate) < new Date() && new Date(t.dueDate).getDate() !== new Date().getDate();
        }).length;

        // High priority
        const highPriority = tasks.filter(t => !t.completed && t.priority === 'High').length;

        // Trend Logic
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Completed this week vs last week logic would be complex with just activityLog if not persistent long enough
        // But let's try to use activityLog
        const recentCompletions = activityLog.filter(log =>
            log.action === 'completed' && new Date(log.timestamp) > oneWeekAgo
        ).length;

        // Simple trend simulation based on rate for now, or use actual if enough data
        // If we have activity log, use it to see if we have high activity recently
        const isActiveRecently = recentCompletions > 0;

        // Rate trend: if rate is high (>50%), we say up, else down. 
        // Real app would store daily snapshots.
        const rateTrend = rate >= 50 ? 'up' : 'down';

        return { total, completed, rate, overdue, highPriority, rateTrend, recentCompletions };
    }, [tasks, activityLog]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Tasks"
                value={stats.total}
                subtext={`${stats.recentCompletions} completed this week`}
                icon={CheckCircle}
                color="bg-blue-500"
                trend="up"
            />
            <StatCard
                title="Completion Rate"
                value={`${stats.rate}%`}
                subtext={stats.rateTrend === 'up' ? "Solid progress" : "Needs improvement"}
                icon={TrendingUp}
                color="bg-green-500"
                trend={stats.rateTrend}
            />
            <StatCard
                title="Overdue Tasks"
                value={stats.overdue}
                subtext={stats.overdue > 0 ? "Needs attention" : "On track"}
                icon={Clock}
                color="bg-red-500"
                trend={stats.overdue > 0 ? 'down' : 'up'}
            />
            <StatCard
                title="High Priority"
                value={stats.highPriority}
                subtext="Pending urgent"
                icon={AlertTriangle}
                color="bg-orange-500"
            />
        </div>
    );
};

export default StatsCards;
