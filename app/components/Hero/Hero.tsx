import React from 'react';
import styles from './Hero.module.css';
import Stars from '../Stars/Stars';

const Hero = () => {

  const colors = [
    '--hero-1',
    '--hero-2',
    '--hero-3',
    '--hero-4',
    '--hero-5',
    '--hero-6',
    '--hero-7',
    '--hero-8',
    '--hero-9',
    '--hero-10',
    '--hero-11',
    '--hero-12',
    '--hero-13',
    '--hero-14',
    '--hero-15',
  ];

  const heights = [
    '48px', '48px', '84px', '96px', '96px', '96px', '96px',
    '96px', '96px', '96px', '96px', '96px', '112px',
  ];

  return (  
    <div className={styles.hero}>
      <div className={styles.heroStaticDots}></div>
      <div> 
        {colors.map((color, index) => (
          <div
            key={index}
            className={styles.heroStaticPiece}
            style={{ height: heights[index], backgroundColor: `var(${color})` }}
          ></div>
        ))}
      </div>
      <Stars count={200} />
    </div>
  );
};

export default Hero;
