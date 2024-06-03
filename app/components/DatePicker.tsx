import React, { useState } from 'react';

interface DatePickerProps {
  onDateChange: (range: 'today' | 'this_week' | 'this_month') => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const [activeRange, setActiveRange] = useState<'today' | 'this_week' | 'this_month'>('today');

  const handleDateChange = (range: 'today' | 'this_week' | 'this_month') => {
    setActiveRange(range);
    onDateChange(range);
  };

  return (
    <div className='text-center'>
      <button
        className={`border rounded my-4 mr-2 md:mr-4 py-2 px-4 text-[10px] md:text-sm ${activeRange === 'today' ? 'bg-white text-black' : 'text-white'}`}
        style={activeRange === 'today' ? { borderColor: 'color(display-p3 0.37 0.1073 0.6327)' } : {}}
        onClick={() => handleDateChange('today')}
      >
        Today
      </button>
      <button
        className={`border rounded my-4 mr-2 md:mr-4 py-2 px-4 text-[10px] md:text-sm  ${activeRange === 'this_week' ? 'bg-white text-black' : 'text-white'}`}
        style={activeRange === 'this_week' ? { borderColor: 'color(display-p3 0.37 0.1073 0.6327)' } : {}}
        onClick={() => handleDateChange('this_week')}
      >
        This Week
      </button>
      <button
        className={`border rounded my-4 mr-2 md:mr-4 py-2 px-4 text-[10px] md:text-sm  ${activeRange === 'this_month' ? 'bg-white text-black' : 'text-white'}`}
        style={activeRange === 'this_month' ? { borderColor: 'color(display-p3 0.37 0.1073 0.6327)' } : {}}
        onClick={() => handleDateChange('this_month')}
      >
        This Month
      </button>
    </div>
  );
};

export default DatePicker;