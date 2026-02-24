
import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

const CompletionChart = ({ range = 'week' }) => {
    const { activityLog } = useTasks();

    const data = useMemo(() => {
        const days = range === 'week' ? 7 : 30;
        const chartData = Array.from({ length: days }, (_, i) => {
            const date = subDays(new Date(), days - 1 - i);
            return {
                date: date,
                label: format(date, range === 'week' ? 'EEE' : 'MMM d'),
                completed: 0
            };
        });

        const startDate = startOfDay(subDays(new Date(), days - 1));

        activityLog.forEach(log => {
            if (log.action === 'completed') {
                const logDate = new Date(log.timestamp);
                if (logDate >= startDate) {
                    const dayStat = chartData.find(d => isSameDay(d.date, logDate));
                    if (dayStat) {
                        dayStat.completed += 1;
                    }
                }
            }
        });

        return chartData;
    }, [activityLog, range]);

    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Completion Trends (Last {range === 'week' ? '7 Days' : '30 Days'})
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#374151' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCompleted)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default CompletionChart;
