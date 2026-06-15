import styles from "./public.module.css";
import { MonitorPlay, Music, Microscope, BookOpen, Home, Palette, Activity, Video } from "lucide-react";

export default function FacilitiesSection({ facilities }) {
  const displayFacilities = [
    { id: 1, name: "Digital Classrooms", description: "Smart boards and projectors for interactive learning.", icon: <MonitorPlay size={32} /> },
    { id: 3, name: "Science Lab", description: "Hands-on science experiments and fair exhibitions.", icon: <Microscope size={32} /> },
    { id: 4, name: "Library", description: "Rich collection of books, magazines and learning resources.", icon: <BookOpen size={32} /> },
    { id: 5, name: "AC Hostel", description: "Air-conditioned hostel with all facilities for outstation students.", icon: <Home size={32} /> },
    { id: 6, name: "Art & Craft", description: "Creative arts programmes for imagination and expression.", icon: <Palette size={32} /> },
    { id: 7, name: "Sports Ground", description: "Open ground for physical education and sports activities.", icon: <Activity size={32} /> },
    { id: 8, name: "24/7 CCTV", description: "Complete campus coverage for student safety and security.", icon: <Video size={32} /> },
  ];

  const bannerImage = "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="facilities" className={styles.section} style={{ paddingBottom: 0 }}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>🏫 INFRASTRUCTURE</div>
        <h2 className={styles.sectionTitle}>Our Facilities</h2>
        <p className={styles.sectionSubtitle}>
          World-class facilities to support holistic development of every student.
        </p>
      </div>

      <div className={styles.grid4} style={{ padding: "0 5% 80px" }}>
        {displayFacilities.map((item) => (
          <div key={item.id} className={styles.premiumCard} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div className={styles.iconBox}>{item.icon}</div>
            <h3 style={{ fontSize: "20px", color: "var(--navy)", marginBottom: "8px", fontWeight: 700 }}>{item.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Full Width Campus Banner */}
      <div style={{ position: "relative", padding: "100px 5%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "white" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(11, 30, 91, 0.8), rgba(30, 58, 138, 0.9))", zIndex: 1 }} />
        
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "24px", lineHeight: 1.2 }}>Creating an Environment Where Every Child Thrives</h2>
          <a href="#contact" className={styles.btnPrimary} style={{ background: "var(--gold)", borderColor: "var(--gold)", color: "var(--navy)" }}>Explore Our Campus</a>
        </div>
      </div>
    </section>
  );
}
