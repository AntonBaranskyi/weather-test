import styles from '../../styles/components/loading-spinner.module.scss';
import { SpinnerSize, SpinnerColor } from './LoadingSpinner';

interface MiniSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

export default function MiniSpinner({ 
  size = 'medium',
  color = 'primary',
  className = ''
}: MiniSpinnerProps) {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color],
    className
  ].filter(Boolean).join(' ');

  return <div className={spinnerClasses} data-testid="mini-spinner"></div>;
}

