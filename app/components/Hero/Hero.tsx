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
      <div className={styles.heroContent}>
        <div className='text-white text-4xl md:text-8xl font-bold'>
          Flashbots Protect
        </div>
      </div>
      <Stars count={100} />
      <div className={styles.moon} style={{ right: '30%' }}></div>
      <div className={styles.cloud} style={{ top: '10%', left: '-10%' }}></div>
      <div className={styles.cloud} style={{ top: '30%', left: '-20%', animationDelay: '5s' }}></div>
      <div className={styles.cloud2} style={{ top: '20%', left: '-10%' }}></div>
      <div className={styles.cloud3} style={{ top: '5%', left: '-10%' }}></div>
      <div className={styles.cloud3} style={{ top: '25%', left: '-10%', animationDelay: '3s' }}></div>
    </div>
  );
};

export default Hero;
