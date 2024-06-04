import React, { useState } from 'react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  onDateChange: (range: 'today' | 'this_week' | 'this_month') => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const [activeRange, setActiveRange] = useState<'today' | 'this_week' | 'this_month'>('this_month');

  const handleDateChange = (range: 'today' | 'this_week' | 'this_month') => {
    setActiveRange(range);
    onDateChange(range);
  };

  return (
    <div className={styles.datePicker}>
      <button
        className={`${styles.dateTab} ${activeRange === 'today' ? styles.active : ''}`}
        onClick={() => handleDateChange('today')}
      >
        Today
      </button>
      <button
        className={`${styles.dateTab} ${activeRange === 'this_week' ? styles.active : ''}`}
        onClick={() => handleDateChange('this_week')}
      >
        7 days
      </button>
      <button
        className={`${styles.dateTab} ${activeRange === 'this_month' ? styles.active : ''}`}
        onClick={() => handleDateChange('this_month')}
      >
        30 days
      </button>
    </div>
  );
};

export default DatePicker;