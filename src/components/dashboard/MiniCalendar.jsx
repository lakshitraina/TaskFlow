
import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

const MiniCalendar = () => {
    const { tasks } = useTasks();
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const days = React.useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const getDayClass = (day) => {
        const hasTask = tasks.some(task =>
            !task.completed &&
            task.dueDate &&
            isSameDay(new Date(task.dueDate), day)
        );

        const isSelectedMonth = isSameMonth(day, currentMonth);
        const isCurrentDay = isToday(day);

        return `
            h-8 w-8 rounded-full flex items-center justify-center text-xs cursor-pointer transition-all
            ${!isSelectedMonth ? 'text-gray-300 font-normal' : 'text-gray-700 dark:text-gray-300 font-medium'}
            ${isCurrentDay ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            ${hasTask && !isCurrentDay ? 'relative after:content-[""] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-red-500 after:rounded-full' : ''}
        `;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <span key={day} className="text-xs text-gray-400 font-medium">
                        {day}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Empty info for start of month offset if needed, though simple grid handles it mostly if we use correct start day logic. 
                    For simplicity in this mini widget, we just list days of month. 
                    A full calendar would need padding days. */}
                {/* Adding padding days for better alignment */}
                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map((day, idx) => (
                    <div key={idx} className="flex justify-center">
                        <button className={getDayClass(day)}>
                            {format(day, 'd')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniCalendar;
