import React, { useState } from 'react';
import './Calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  events?: { date: Date; title: string; color?: string }[];
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  onDateSelect,
  selectedDate,
  events = []
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    onDateSelect?.(newDate);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const hasEvent = (day: number) => {
    return events.some(e => e.date.getDate() === day && e.date.getMonth() === month && e.date.getFullYear() === year);
  };

  // Generate grid
  const blanks = Array.from({ length: firstDay }).map((_, i) => (
    <div key={`blank-${i}`} className="ds-calendar-day empty"></div>
  ));
  const daysInMonthArr = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    return (
      <div 
        key={day} 
        className={`ds-calendar-day ${isSelected(day) ? 'selected' : ''} ${isToday(day) ? 'today' : ''} ${hasEvent(day) ? 'has-event' : ''}`}
        onClick={() => handleDayClick(day)}
      >
        <span className="ds-calendar-day-number">{day}</span>
        {hasEvent(day) && <span className="ds-calendar-day-dot" />}
      </div>
    );
  });

  const totalSlots = [...blanks, ...daysInMonthArr];

  return (
    <div className="ds-calendar">
      <div className="ds-calendar-header">
        <button onClick={prevMonth} className="ds-calendar-nav-btn"><ChevronLeft size={20} /></button>
        <h4 className="ds-calendar-title">{monthNames[month]} {year}</h4>
        <button onClick={nextMonth} className="ds-calendar-nav-btn"><ChevronRight size={20} /></button>
      </div>
      
      <div className="ds-calendar-grid ds-calendar-weekdays">
        {dayNames.map(d => (
          <div key={d} className="ds-calendar-weekday">{d}</div>
        ))}
      </div>
      
      <div className="ds-calendar-grid ds-calendar-days">
        {totalSlots}
      </div>
    </div>
  );
};
