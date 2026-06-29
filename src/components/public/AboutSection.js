import styles from "./public.module.css";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

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
    <section id="about" className={styles.sectionLight} style={{ position: "relative", overflow: "hidden", padding: "120px 5%" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "clamp(40px, 8vw, 100px)", alignItems: "center" }}>
        
        {/* Left: Image Composition */}
        <div style={{ position: "relative", paddingRight: "20px", display: "flex", flexDirection: "column" }} className="animateFadeUp delay1">
          {/* Experience Card Moved Above Image */}
          <div style={{ marginBottom: "20px", background: "var(--white)", padding: "16px 24px", borderRadius: "16px", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", gap: "20px", alignSelf: "flex-start", zIndex: 2, border: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "40px", fontWeight: 800, color: "var(--royal-blue)", lineHeight: 1 }}>15+</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.3, textTransform: "uppercase" }}>Years of<br/>Excellence</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100%", height: "100%", background: "var(--gold)", borderRadius: "var(--radius-lg)", zIndex: 0, opacity: 0.1 }} />
            <Image 
              src="/poster.jpg" 
              alt="Students Learning" 
              width={800}
              height={600}
              style={{ width: "100%", height: "auto", maxHeight: "600px", objectFit: "contain", borderRadius: "var(--radius-lg)", position: "relative", zIndex: 1, boxShadow: "var(--shadow-lg)", background: "var(--light-bg)" }} 
            />
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

          <div className={styles.aboutChecklist}>
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
