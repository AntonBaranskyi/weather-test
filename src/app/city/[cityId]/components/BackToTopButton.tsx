'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/styles/components/city-details.module.scss';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className={styles.backToTopButton}
      onClick={scrollToTop}
      aria-label="Прокрутити вгору"
    >
      <svg
        className={styles.backToTopIcon}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L4 12H9V20H15V12H20L12 4Z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.backToTopText}>Вгору</span>
    </button>
  );
}
