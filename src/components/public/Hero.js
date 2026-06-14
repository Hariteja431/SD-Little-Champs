"use client";
import styles from "./public.module.css";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function Hero({ settings }) {
  const heroImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="home" className={styles.heroPremium}>
      <div className={styles.heroPremiumBg} />
      <div className={styles.heroPremiumGradient} />
      
      <div className={styles.heroPremiumContent}>
        <div className={styles.heroPremiumText}>
          {/* Admission Badge */}
          <div className="animateFadeUp delay1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--white)", border: "1px solid var(--gold)", padding: "8px 20px", borderRadius: "30px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "32px", color: "var(--navy)", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", width: "fit-content" }}>
            <span style={{ fontSize: "18px" }}>🎓</span>
            Admissions Open 2026–27
          </div>
          
          {/* Main Heading */}
          <h1 className="font-heading animateFadeUp delay2" style={{ fontSize: "clamp(42px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.15, marginBottom: "24px", color: "var(--navy)" }}>
            Nurturing Young Minds,<br/>
            <span style={{ color: "var(--gold)" }}>Building Bright Futures</span>
          </h1>
          
          {/* Supporting Text */}
          <p className="animateFadeUp delay3" style={{ fontSize: "18px", color: "var(--text-muted)", maxWidth: "500px", marginBottom: "40px", lineHeight: 1.7, fontWeight: 500 }}>
            {settings?.heroSubtitle || "A place where curiosity grows, talents shine, and every child is inspired to achieve their best."}
          </p>
          
          {/* CTA Buttons */}
          <div className="animateFadeUp delay4" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--gold)", color: "var(--white)", padding: "16px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: 700, textDecoration: "none", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              Apply for Admission <ArrowRight size={18} />
            </a>
            <a href="#about" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--white)", color: "var(--navy)", border: "1px solid var(--navy)", padding: "16px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: 700, textDecoration: "none", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} onMouseOver={e => { e.currentTarget.style.background = "var(--navy)"; e.currentTarget.style.color = "white"; }} onMouseOut={e => { e.currentTarget.style.background = "var(--white)"; e.currentTarget.style.color = "var(--navy)"; }}>
              Explore Our Campus <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.heroStatsContainer}>
        {/* Statistics Card */}
        <div className={`animateFadeUp delay5 ${styles.heroStatsCard}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>1000+</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginTop: "4px" }}>Students</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>50+</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginTop: "4px" }}>Teachers</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>15+</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginTop: "4px" }}>Years Excellence</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--navy)", lineHeight: 1.2 }}>Holistic Education</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>For Lifelong Success</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
