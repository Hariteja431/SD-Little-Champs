import styles from "./public.module.css";
import { Bell, CalendarDays, ArrowRight, Calendar, Flag, Sparkles, Trophy } from "lucide-react";

export default function NoticesSection({ notices }) {
  const defaultNotices = [
    { id: 1, title: "Parent-Teacher Meeting", date: "2026-06-15", type: "Academics", body: "A mandatory PTM will be held to discuss academic progress." },
    { id: 2, title: "Summer Vacation Schedule", date: "2026-06-20", type: "Holiday", body: "Summer vacations begin from the 20th of June. School reopens in August." },
    { id: 3, title: "Science Exhibition Registration", date: "2026-06-25", type: "Event", body: "Register your projects for the upcoming State-level Science Exhibition." },
    { id: 4, title: "Quarterly Examination Timetable", date: "2026-07-01", type: "Exam", body: "The timetable for quarterly examinations has been released on the portal." },
  ];

  const displayNotices = notices && notices.length > 0 ? notices.filter(n => (n.body && n.body !== "") && n.title !== "Welcome to our new website" || (n.body && n.body.includes("We are excited to launch"))) : defaultNotices;

  return (
    <section id="notices" className={styles.sectionLight}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>📢 UPDATES</div>
        <h2 className={styles.sectionTitle}>Latest Announcements & Events</h2>
        <p className={styles.sectionSubtitle}>
          Stay informed with important school notices, events, examinations, and announcements.
        </p>
      </div>

      <div style={{ maxWidth: "1400px", margin: "40px auto 0", padding: "0 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "24px" }}>
          {displayNotices.slice(0, 6).map((notice, i) => (
            <div key={`${notice.id}-${i}`} className={styles.premiumCard} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", height: "100%", background: "var(--white)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.03)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.08)"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(30, 58, 138, 0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy)", flexShrink: 0 }}>
                  <Bell size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px" }}>{notice.type || "Update"}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{new Date(notice.date).toLocaleDateString()}</span>
                  </div>
                  <h5 style={{ fontSize: "18px", color: "var(--navy)", fontWeight: 800, lineHeight: 1.3 }}>{notice.title}</h5>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginTop: "4px" }}>{notice.body}</p>
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
