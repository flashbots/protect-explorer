import React, { useEffect, useState } from 'react';
import styles from './Stars.module.css';

interface StarProps {
  top: number;
  left: number;
  duration: number;
  size: number;
  color: string;
}

const Star = ({ top, left, duration, size, color }: StarProps) => (
  <div
    className={styles.star}
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
    }}
  />
);

const Stars = ({ count = 0, newStars }: { count?: number; newStars?: StarProps[] }) => {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (count > 0) {
      const starsArray = [];
      for (let i = 0; i < count; i++) {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const duration = Math.random() * 2 + 1;
        starsArray.push(<Star key={i} top={top} left={left} duration={duration} size={2} color="white" />);
      }
      setStars(starsArray);
    }
  }, [count]);

  useEffect(() => {
    if (newStars && newStars.length > 0) {
      const newStarsArray = newStars.map((star, index) => (
        <Star
          key={`new-${index}`}
          top={star.top}
          left={star.left}
          duration={star.duration}
          size={star.size}
          color={star.color}
        />
      ));
      setStars(prevStars => [...prevStars, ...newStarsArray]);
      
      const timer = setTimeout(() => {
        setStars(prevStars => prevStars.slice(0, count));
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [newStars, count]);

  return <div className={styles.stars}>{stars}</div>;
};

export default Stars;