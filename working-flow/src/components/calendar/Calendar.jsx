import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('month')}
            className={view === 'month' ? 'bg-blue-500/20 text-blue-400' : ''}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('week')}
            className={view === 'week' ? 'bg-blue-500/20 text-blue-400' : ''}
          >
            Week
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded-full">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h2 className="text-lg font-semibold text-gray-200">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-full">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => onDateSelect(day)}
            className={`
              p-2 text-sm rounded-lg transition-colors
              ${isSameMonth(day, currentDate) ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-600'}
              ${selectedDate && isSameDay(day, selectedDate) ? 'bg-blue-500/20 text-blue-400' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
