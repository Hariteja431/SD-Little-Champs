import styles from "./public.module.css";

export default function AnnouncementTicker({ text }) {
  if (!text) return null;

  return (
    <div className={styles.marqueeContainer} style={{ marginTop: "40px", position: "relative", background: "var(--white)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "16px 0" }}>
      
      <div className={styles.marqueeTrack} style={{ display: "flex", alignItems: "center", gap: "50px", whiteSpace: "nowrap" }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <span style={{ fontSize: "16px", color: "var(--navy)", fontWeight: 800 }}>📢 NOTICE</span>
            <span style={{ fontSize: "16px", color: "var(--royal-blue)", fontWeight: 600 }}>{text}</span>
            <span style={{ color: "var(--gold)" }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
