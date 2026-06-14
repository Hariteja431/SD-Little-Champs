import styles from "./public.module.css";

export default function AnnouncementTicker({ text }) {
  if (!text) return null;

  return (
    <div className={styles.ticker}>
      <span className={styles.tickerBadge}>📢 NOTICE</span>
      <div className={styles.tickerText}>
        {text}
      </div>
    </div>
  );
}
