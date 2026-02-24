
import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';

const TaskDistributionChart = () => {
    const { tasks } = useTasks();

    const data = useMemo(() => {
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.filter(t => !t.completed).length;
        const highPriority = tasks.filter(t => !t.completed && t.priority === 'High').length;
        const normalPriority = tasks.filter(t => !t.completed && t.priority !== 'High').length;

        return [
            { name: 'Completed', value: completed, color: '#10B981' }, // Green
            { name: 'Pending (Normal)', value: normalPriority, color: '#3B82F6' }, // Blue
            { name: 'Pending (High Priority)', value: highPriority, color: '#EF4444' } // Red
        ].filter(item => item.value > 0);
    }, [tasks]);

    return (
        <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Task Distribution</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default TaskDistributionChart;
