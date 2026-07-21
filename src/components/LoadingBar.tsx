import styles from './LoadingBar.module.scss';

export default function LoadingBar() {
  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.bar} />
    </div>
  );
}
