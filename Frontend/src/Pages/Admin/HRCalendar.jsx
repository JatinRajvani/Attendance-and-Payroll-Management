import React, { useState } from 'react';
import Header from '../../Components/Header';
import Sidebar from '../../Components/HRSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

const HRCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const holidays = {
    '2025-05-04': 'Labor Day',
    '2025-05-11': 'Mother’s Day',
    '2025-05-18': 'Annual Function',
    '2025-05-25': 'Client Visit',
  };

  const startOfMonth = currentDate.startOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">Calendar</h2>

          <div className="bg-white shadow-md rounded-xl p-6">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={prevMonth}><ChevronLeft className="text-gray-600" /></button>
              <h3 className="text-lg font-semibold">{currentDate.format('MMMM YYYY')}</h3>
              <button onClick={nextMonth}><ChevronRight className="text-gray-600" /></button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {days.map((day, idx) => {
                if (!day) return <div key={idx}></div>;
                const fullDate = currentDate.date(day).format('YYYY-MM-DD');
                const isHoliday = holidays[fullDate];
                const isSunday = currentDate.date(day).day() === 0;

                return (
                  <div
                    key={idx}
                    className={`h-20 flex flex-col justify-center items-center rounded-lg 
                      ${isHoliday ? 'text-purple-600 font-semibold' : ''}
                      ${isSunday ? 'text-red-600 font-medium' : ''}
                    `}
                  >
                    <div className="text-base">{day}</div>
                    {(isHoliday || isSunday) && (
                      <div className="text-xs mt-1">
                        {isHoliday ? holidays[fullDate] : 'Holiday'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Holiday Form */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 w-full md:w-[700px]">
            <h4 className="text-lg font-semibold mb-4">Add Holiday</h4>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="DD"
                className="border px-3 py-2 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="MM"
                className="border px-3 py-2 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="YY"
                className="border px-3 py-2 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Reason Behind Giving Holiday"
                className="col-span-4 border px-3 py-2 rounded-lg focus:outline-none"
              />
            </div>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRCalendar;
