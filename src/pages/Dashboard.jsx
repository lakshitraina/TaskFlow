import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import TaskProgress from '../components/dashboard/TaskProgress';
import TaskList from '../components/dashboard/TaskList';
import TaskForm from '../components/dashboard/TaskForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

import ProductivityChart from '../components/dashboard/ProductivityChart';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import RecordActivity from '../components/dashboard/RecentActivity';
import LiveGreeting from '../components/dashboard/LiveGreeting';
import QuickAddTask from '../components/dashboard/QuickAddTask';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import TaskDetailsModal from '../components/dashboard/TaskDetailsModal';

const Dashboard = () => {
    const { tasks } = useTasks();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null);

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const displayUserName = user.name || 'User';

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 w-full">
                {/* Left - Title & Subtitle */}
                <div className="flex-1 w-full text-center md:text-left">
                    <h1 className="text-[32px] font-black tracking-tight text-zinc-900 mb-1 leading-none">Dashboard</h1>
                    <p className="text-[15px] font-medium text-pw-muted">
                        Overview of your team's workflow
                    </p>
                </div>

                {/* Right - Action Button */}
                <div className="w-full md:w-auto flex justify-center md:justify-end">
                    <button
                        onClick={handleCreateTask}
                        className="bg-pw-green hover:bg-[#0da672] text-white px-6 py-3 rounded-full font-bold text-[15px] flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(14,183,129,0.2)] hover:shadow-[0_8px_24px_rgba(14,183,129,0.3)] hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5 stroke-[2.5px]" />
                        New Task
                    </button>
                </div>
            </div>

            {/* New 3-Column Masonry Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 items-start">

                {/* Column 1: Context & Time (xl: 3 spans) */}
                <div className="xl:col-span-3 space-y-6 flex flex-col">
                    <LiveGreeting userName={displayUserName.split(' ')[0]} />
                    <TodaysFocus />
                    <MiniCalendar />
                </div>

                {/* Column 2: Core Actions & Lists (xl: 6 spans) */}
                <div className="xl:col-span-6 space-y-6 flex flex-col">
                    <SummaryCards />
                    <QuickAddTask />
                    <TaskList onEdit={handleEditTask} />
                </div>

                {/* Column 3: Tracking & History (xl: 3 spans) */}
                <div className="xl:col-span-3 space-y-6 flex flex-col">
                    <TaskProgress total={tasks.length} completed={tasks.filter(t => t.completed).length} />
                    <ProductivityChart />
                    <UpcomingDeadlines />
                    <RecordActivity />
                </div>

            </div>

            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <TaskForm
                    onClose={() => setIsTaskModalOpen(false)}
                    initialData={editingTask}
                />
            </Modal>

            <TaskDetailsModal
                isOpen={!!viewingTask}
                onClose={() => setViewingTask(null)}
                task={viewingTask}
                onEdit={(task) => {
                    setViewingTask(null);
                    handleEditTask(task);
                }}
            />
        </DashboardLayout>
    );
};

export default Dashboard;
