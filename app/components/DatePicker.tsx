import React from 'react';

interface DatePickerProps {
  onDateChange: (range: 'today' | 'this_week' | 'this_month') => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  return (
    <div className='text-center'>
      <button className='border border-white rounded my-4 mr-4 py-2 px-4 text-white' onClick={() => onDateChange('today')}>Today</button>
      <button className='border border-white rounded my-4 mr-4 py-2 px-4 text-white' onClick={() => onDateChange('this_week')}>This Week</button>
      <button className='border border-white rounded my-4 mr-4 py-2 px-4 text-white' onClick={() => onDateChange('this_month')}>This Month</button>
    </div>
  );
};

export default DatePicker;
