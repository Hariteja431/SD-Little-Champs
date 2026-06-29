import styles from "./public.module.css";
import { Trophy, Medal, Star, Home, Award, TrendingUp } from "lucide-react";

export default function AchievementsSection() {
  const topScores = [
    { name: "S.R.R. Tagore", ht: "1068002", score: "98.75" },
    { name: "R. Jay Karthik", ht: "1068128", score: "91.25" },
    { name: "B. Chethan", ht: "1068380", score: "91.25" },
    { name: "K. Karthikeya", ht: "1067623", score: "91.25" },
    { name: "N. Sugamya", ht: "1068056", score: "88.75" },
    { name: "K. Usha", ht: "1067962", score: "88.75" },
    { name: "N. Jessica", ht: "1068209", score: "86.25" },
    { name: "L. Rishi", ht: "1067958", score: "86.25" },
    { name: "S. Aadya", ht: "1067968", score: "85.00" },
    { name: "B. Jayasri", ht: "1068044", score: "83.75" },
    { name: "G. Himanvitha", ht: "1068202", score: "83.75" },
    { name: "S. Dhanyasri", ht: "1067961", score: "81.25" },
    { name: "M. Lalitha Aditya", ht: "1069612", score: "81.25" },
  ];

  return (
    <section id="achievements" className={styles.sectionLight} style={{ paddingBottom: "40px" }}>
      <div className={styles.sectionHeader} style={{ maxWidth: "800px" }}>
        <div className={styles.sectionBadge}>🏆 RESULTS 2026</div>
        <h2 className={styles.sectionTitle}>SD Academy Created a Sensation</h2>
        <p className={styles.sectionSubtitle} style={{ color: "var(--navy)", fontWeight: 600, fontSize: "22px", marginBottom: "8px" }}>
          All India & State Ranks in Sainik & Navodaya
        </p>
        <p className={styles.sectionSubtitle}>
          Celebrating the hard work and extraordinary success of our students in the 2026 competitive examinations.
        </p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statBlock}>
          <Trophy size={36} />
          <h3>98.75 <span style={{fontSize: "16px", color: "var(--text-muted)", fontWeight: 600}}>/ 100</span></h3>
          <p>All-Time Record<br/><span style={{textTransform: "none", color: "var(--navy)"}}>S.R.R. Tagore</span></p>
        </div>
        <div className={styles.statBlock}>
          <TrendingUp size={36} />
          <h3>252 <span style={{fontSize: "16px", color: "var(--text-muted)", fontWeight: 600}}>/ 300</span></h3>
          <p>Top Score<br/><span style={{textTransform: "none", color: "var(--navy)"}}>S. Tagore</span></p>
        </div>
        <div className={styles.statBlock}>
          <Star size={36} />
          <h3>14+</h3>
          <p>Students with State/National Ranks</p>
        </div>
        <div className={styles.statBlock}>
          <Home size={36} />
          <h3 style={{fontSize: "24px", marginTop: "12px"}}>AC Hostel</h3>
          <p>Facility Available</p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "var(--white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "40px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px", borderBottom: "2px solid rgba(0,0,0,0.05)", paddingBottom: "20px" }}>
          <Award size={28} color="var(--gold)" />
          <h3 style={{ fontSize: "24px", color: "var(--navy)", fontWeight: 800 }}>Navodaya 2026 Top Achievers</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {topScores.map((student, idx) => (
            <div key={idx} style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "16px 20px", 
              borderRadius: "12px", 
              background: idx === 0 ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))" : "var(--light-bg)",
              border: idx === 0 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(0,0,0,0.03)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ 
                  width: "40px", height: "40px", 
                  borderRadius: "50%", 
                  background: idx === 0 ? "var(--gold)" : "var(--white)", 
                  color: idx === 0 ? "var(--white)" : "var(--navy)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "16px",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  #{idx + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy)", marginBottom: "2px" }}>{student.name}</h4>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>HT: {student.ht}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: idx === 0 ? "var(--gold)" : "var(--royal-blue)" }}>{student.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h3 style={{ fontSize: "24px", color: "var(--navy)", marginBottom: "24px" }}>Join Our Success Story</h3>
        <a href="#contact" className={styles.btnPrimary}>Apply for Admission</a>
      </div>
    </section>
  );
}
