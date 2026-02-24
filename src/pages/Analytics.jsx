
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCards from '../components/analytics/StatsCards';
import CompletionChart from '../components/analytics/CompletionChart';
import TaskDistributionChart from '../components/analytics/TaskDistributionChart';
import AnalyticsSummary from '../components/analytics/AnalyticsSummary';

const Analytics = () => {
    // In a real app, this state would filter the data passed to charts
    const [dateRange, setDateRange] = useState('week');

    return (
        <DashboardLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-black tracking-tight text-zinc-900 mb-1 leading-none">Analytics</h1>
                    <p className="text-[15px] font-medium text-pw-muted">Track your productivity and task completion trends.</p>
                </div>

                <div className="flex z-10 p-1 bg-pw-pill-bg border border-pw-border/60 rounded-[20px] shadow-sm self-start md:self-auto">
                    {['week', 'month'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-6 py-2.5 text-[14px] font-bold rounded-2xl transition-all ${dateRange === range
                                ? 'bg-pw-blue text-white shadow-sm'
                                : 'text-pw-muted hover:text-pw-text hover:bg-white/50'
                                }`}
                        >
                            Last {range === 'week' ? '7 Days' : '30 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* New Feature: Analytics Summary Header */}
            <AnalyticsSummary />

            {/* Reorganized Charts: 50/50 side-by-side split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">
                <div className="h-full flex flex-col">
                    <CompletionChart range={dateRange} />
                </div>
                <div className="h-full flex flex-col">
                    <TaskDistributionChart />
                </div>
            </div>

            {/* Move Stats Cards to the bottom as a detailed breakdown */}
            <StatsCards />
        </DashboardLayout>
    );
};

export default Analytics;
