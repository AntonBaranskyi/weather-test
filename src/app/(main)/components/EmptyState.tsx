import styles from '../../styles/components/home.module.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
}

export default function EmptyState({ 
  icon = '🌤️', 
  title, 
  description 
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyDescription}>{description}</p>
    </div>
  );
}

