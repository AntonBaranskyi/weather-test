import styles from '../../styles/components/loading-spinner.module.scss';

export type SpinnerSize = 'small' | 'medium' | 'large' | 'extraLarge';
export type SpinnerColor = 'primary' | 'success' | 'warning' | 'error';

interface LoadingSpinnerProps {
  text?: string;
  size?: SpinnerSize;
  color?: SpinnerColor;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  text = 'Завантаження...', 
  size = 'large',
  color = 'primary',
  fullScreen = true
}: LoadingSpinnerProps) {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color]
  ].join(' ');

  const containerClasses = fullScreen 
    ? styles.loadingContainer 
    : styles.loadingContent;

  return (
    <div className={containerClasses}>
      <div className={styles.loadingContent}>
        <div className={spinnerClasses}></div>
        {text && <p className={styles.loadingText}>{text}</p>}
      </div>
    </div>
  );
}
