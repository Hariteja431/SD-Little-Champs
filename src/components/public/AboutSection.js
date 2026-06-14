import styles from "./public.module.css";
import { BookOpen, Users, ShieldCheck, MonitorPlay, Activity, Heart } from "lucide-react";

export default function AboutSection({ settings }) {
  const whyUs = [
    { id: 1, title: "Academic Excellence", desc: "Rigorous curriculum focused on conceptual clarity.", icon: <BookOpen size={32} /> },
    { id: 2, title: "Experienced Faculty", desc: "Highly qualified and dedicated teaching staff.", icon: <Users size={32} /> },
    { id: 3, title: "Safe Environment", desc: "24/7 security and a supportive atmosphere.", icon: <ShieldCheck size={32} /> },
    { id: 4, title: "Smart Learning", desc: "Digital classrooms equipped with modern tech.", icon: <MonitorPlay size={32} /> },
    { id: 5, title: "Sports & Activities", desc: "Focus on physical fitness and extracurriculars.", icon: <Activity size={32} /> },
    { id: 6, title: "Value-Based Ed", desc: "Instilling strong moral character and ethics.", icon: <Heart size={32} /> },
  ];

  return (
    <section id="about" className={styles.sectionLight}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>ABOUT US</div>
        <h2 className={styles.sectionTitle}>Why Choose SD Little Champ's E.M School?</h2>
        <p className={styles.sectionSubtitle}>
          At SD Little Champ's E.M School, Balli Gattam, Narsipatnam, we believe that every child is unique and deserves an environment where they can learn, grow, and succeed with confidence. Our mission is to provide quality education that nurtures academic excellence, strong values, creativity, and leadership skills.
        </p>
        <p className={styles.sectionSubtitle} style={{ marginTop: "16px" }}>
          We combine modern teaching methods with a caring and supportive atmosphere to ensure that students develop not only knowledge but also character and life skills.
        </p>
      </div>

      <div className={styles.grid3}>
        {whyUs.map((item) => (
          <div key={item.id} className={styles.premiumCard}>
            <div className={styles.iconBox}>{item.icon}</div>
            <h3 style={{ fontSize: "20px", color: "var(--navy)", marginBottom: "8px", fontWeight: 700 }}>{item.title}</h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
