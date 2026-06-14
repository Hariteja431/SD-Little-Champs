import styles from "./public.module.css";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutSection({ settings }) {
  const features = [
    "Academic Excellence",
    "Experienced Faculty",
    "Safe Environment",
    "Smart Learning",
    "Sports & Activities",
    "Value-Based Ed"
  ];

  return (
    <section id="about" className={styles.sectionLight} style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "60px", alignItems: "center" }}>
        
        {/* Left: Image Composition */}
        <div style={{ position: "relative", paddingRight: "20px" }} className="animateFadeUp delay1">
          <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100%", height: "100%", background: "var(--gold)", borderRadius: "var(--radius-lg)", zIndex: 0, opacity: 0.1 }} />
          <img 
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
            alt="Students Learning" 
            style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "var(--radius-lg)", position: "relative", zIndex: 1, boxShadow: "var(--shadow-lg)" }} 
          />
          {/* Floating Experience Card */}
          <div style={{ position: "absolute", bottom: "-30px", right: "10px", background: "var(--white)", padding: "24px", borderRadius: "16px", boxShadow: "var(--shadow-lg)", zIndex: 2, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "42px", fontWeight: 800, color: "var(--royal-blue)", lineHeight: 1 }}>15+</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.3, textTransform: "uppercase" }}>Years of<br/>Excellence</div>
          </div>
        </div>

        {/* Right: Typography & Features */}
        <div className="animateFadeUp delay2">
          <div className={styles.sectionBadge}>ABOUT US</div>
          <h2 className="font-heading" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--navy)", marginBottom: "24px", fontWeight: 800, lineHeight: 1.1 }}>
            Why Choose SD Little Champ's E.M School?
          </h2>
          
          <div style={{ background: "var(--white)", padding: "24px", borderRadius: "12px", borderLeft: "4px solid var(--gold)", marginBottom: "32px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ color: "var(--navy)", fontSize: "18px", fontWeight: 600, lineHeight: 1.6 }}>
              "Our mission is to provide quality education that nurtures academic excellence, strong values, creativity, and leadership skills."
            </p>
          </div>
          
          <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.8, marginBottom: "40px" }}>
            At SD Little Champ's E.M School, Balli Gattam, Narsipatnam, we believe that every child is unique and deserves an environment where they can learn, grow, and succeed with confidence. We combine modern teaching methods with a caring and supportive atmosphere to ensure that students develop not only knowledge but also character and life skills.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
            {features.map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <CheckCircle2 color="var(--gold)" fill="rgba(212, 175, 55, 0.1)" size={20} />
                <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--navy)" }}>{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
