import React, { useEffect, useState } from 'react';
import styles from './Stars.module.css';

const Star = ({ top, left, duration }: { top: number; left: number; duration: number }) => (
  <div
    className={styles.star}
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
    }}
  />
);

const Stars = ({ count = 100 }: { count?: number }) => {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const starsArray = [];
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 2 + 1;
      starsArray.push(<Star key={i} top={top} left={left} duration={duration} />);
    }
    setStars(starsArray);
  }, [count]);

  return <div className={styles.stars}>{stars}</div>;
};

export default Stars;
