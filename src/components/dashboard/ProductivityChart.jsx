
import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

const ProductivityChart = () => {
    const { activityLog, tasks } = useTasks();
    const [view, setView] = useState('weekly'); // weekly, monthly

    const data = useMemo(() => {
        const today = new Date();
        let chartData = [];

        if (view === 'weekly') {
            chartData = Array.from({ length: 7 }, (_, i) => {
                const date = subDays(today, 6 - i);
                return {
                    name: format(date, 'EEE'),
                    date: date,
                    completed: 0,
                    score: 0
                };
            });
        } else {
            // Monthly view - last 30 days
            chartData = Array.from({ length: 30 }, (_, i) => {
                const date = subDays(today, 29 - i);
                return {
                    name: format(date, 'dd'),
                    date: date,
                    completed: 0
                };
            });
        }

        activityLog.forEach(log => {
            if (log.action === 'completed') {
                const logDate = new Date(log.timestamp);
                const dayStat = chartData.find(d => isSameDay(d.date, logDate));
                if (dayStat) {
                    dayStat.completed += 1;
                }
            }
        });

        return chartData;
    }, [activityLog, view]);

    // Calculate productivity score (mock formula: completion % * 10)
    const productivityScore = useMemo(() => {
        const total = tasks.filter(t => t.completed).length;
        return Math.min(100, total * 5);
    }, [tasks]);

    return (
        <Card className="p-6 bg-pw-card rounded-[32px] border border-pw-border/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-[20px] font-bold text-pw-text flex items-center gap-2 tracking-tight">
                        <TrendingUp className="w-5 h-5 text-pw-green" strokeWidth={2.5} />
                        Productivity Analytics
                    </h2>
                </div>
                <div className="flex bg-pw-pill-bg rounded-[14px] p-1 border border-pw-border/50">
                    <button
                        onClick={() => setView('weekly')}
                        className={`px-4 py-1.5 text-[13px] font-bold transition-all rounded-[10px] ${view === 'weekly'
                            ? 'bg-white text-pw-text shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                            : 'text-pw-muted hover:text-pw-text'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setView('monthly')}
                        className={`px-4 py-1.5 text-[13px] font-bold transition-all rounded-[10px] ${view === 'monthly'
                            ? 'bg-white text-pw-text shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                            : 'text-pw-muted hover:text-pw-text'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {view === 'weekly' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
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
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#0eb781"
                                strokeWidth={3}
                                dot={{ fill: '#0eb781', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                dy={10}
                                interval={2}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar
                                dataKey="completed"
                                fill="#0eb781"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-pw-border border-dashed">
                <div>
                    <span className="text-[11px] font-bold text-pw-muted uppercase tracking-widest block mb-1">Productivity Score</span>
                    <span className="text-2xl font-bold text-pw-text">{productivityScore}%</span>
                </div>
                <div className="text-right">
                    <span className="text-[11px] font-bold text-pw-muted uppercase tracking-widest block mb-1">Focus Time</span>
                    <span className="text-lg font-bold text-pw-purple">
                        {Math.round(tasks.reduce((acc, t) => acc + (t.focusTime || 0), 0) / 60)} mins
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default ProductivityChart;
