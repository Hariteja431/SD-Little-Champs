import styles from "./public.module.css";
import { Bell, CalendarDays, ArrowRight, Calendar, Flag, Sparkles, Trophy } from "lucide-react";

export default function NoticesSection({ notices }) {
  const defaultNotices = [
    { id: 1, title: "Parent-Teacher Meeting", date: "2026-06-15", type: "Academics", body: "A mandatory PTM will be held to discuss academic progress." },
    { id: 2, title: "Summer Vacation Schedule", date: "2026-06-20", type: "Holiday", body: "Summer vacations begin from the 20th of June. School reopens in August." },
    { id: 3, title: "Science Exhibition Registration", date: "2026-06-25", type: "Event", body: "Register your projects for the upcoming State-level Science Exhibition." },
    { id: 4, title: "Quarterly Examination Timetable", date: "2026-07-01", type: "Exam", body: "The timetable for quarterly examinations has been released on the portal." },
  ];

  const displayNotices = notices && notices.length > 0 ? notices.filter(n => n.body !== "" && n.title !== "Welcome to our new website" || n.body.includes("We are excited to launch")) : defaultNotices;

  return (
    <section id="notices" className={styles.sectionLight}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>📢 UPDATES</div>
        <h2 className={styles.sectionTitle}>Latest Announcements & Events</h2>
        <p className={styles.sectionSubtitle}>
          Stay informed with important school notices, events, examinations, and announcements.
        </p>
      </div>

      <div className={styles.marqueeContainer} style={{ position: "relative" }}>
        {/* Fading Edges */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100px", height: "100%", background: "linear-gradient(to right, var(--light-bg), transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100%", background: "linear-gradient(to left, var(--light-bg), transparent)", zIndex: 2 }} />
        
        <div className={styles.marqueeTrack} style={{ display: "flex", alignItems: "center", padding: "20px 0" }}>
          {[...displayNotices, ...displayNotices, ...displayNotices, ...displayNotices].map((notice, i) => (
            <div key={`${notice.id}-${i}`} className="premiumCard" style={{ minWidth: "350px", maxWidth: "350px", padding: "20px", display: "flex", gap: "16px", margin: "0 15px", flexShrink: 0 }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(30, 58, 138, 0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--royal-blue)", flexShrink: 0 }}>
                <Bell size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px" }}>{notice.type}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{new Date(notice.date).toLocaleDateString()}</span>
                </div>
                <h5 style={{ fontSize: "15px", color: "var(--navy)", fontWeight: 700, marginBottom: "8px", lineHeight: 1.3 }}>{notice.title}</h5>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{notice.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: Upcoming Events Timeline */}
      <div style={{ marginTop: "80px" }}>
        <h4 style={{ textAlign: "center", fontSize: "24px", color: "var(--navy)", fontWeight: 800, marginBottom: "40px" }}>Upcoming Events Calendar</h4>
        <div className={styles.grid4}>
          <div className={styles.premiumCard} style={{ textAlign: "center", padding: "30px 20px" }}>
            <Sparkles size={40} style={{ color: "var(--gold)", margin: "0 auto 16px" }} />
            <h5 style={{ fontSize: "18px", color: "var(--navy)", fontWeight: 700 }}>Annual Day</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>December 2026</p>
          </div>
          <div className={styles.premiumCard} style={{ textAlign: "center", padding: "30px 20px" }}>
            <Flag size={40} style={{ color: "var(--royal-blue)", margin: "0 auto 16px" }} />
            <h5 style={{ fontSize: "18px", color: "var(--navy)", fontWeight: 700 }}>Sports Meet</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>January 2027</p>
          </div>
          <div className={styles.premiumCard} style={{ textAlign: "center", padding: "30px 20px" }}>
            <Calendar size={40} style={{ color: "var(--navy)", margin: "0 auto 16px" }} />
            <h5 style={{ fontSize: "18px", color: "var(--navy)", fontWeight: 700 }}>Science Fair</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>February 2027</p>
          </div>
          <div className={styles.premiumCard} style={{ textAlign: "center", padding: "30px 20px" }}>
            <Trophy size={40} style={{ color: "var(--gold)", margin: "0 auto 16px" }} />
            <h5 style={{ fontSize: "18px", color: "var(--navy)", fontWeight: 700 }}>Graduation</h5>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>April 2027</p>
          </div>
        </div>
      </div>
    </section>
  );
}
