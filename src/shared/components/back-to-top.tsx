import React from 'react';

import styles from '@/app/styles/components/back-to-top.module.scss';

const BackToTop = () => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.backToTopContainer}>
      <button className={styles.backToTopButton} onClick={scrollToTop}>
        Back to top
      </button>
    </div>
  );
};

export default BackToTop;
