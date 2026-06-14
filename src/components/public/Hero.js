"use client";
import styles from "./public.module.css";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function Hero({ settings }) {
  const heroImage = "/poster.jpg";

  return (
    <section id="home" style={{ position: "relative", height: "100vh", minHeight: "800px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "white", overflow: "hidden" }}>
      {/* Background Image & Overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", zIndex: 0, transform: "scale(1.05)", animation: "kenburns 20s infinite alternate ease-in-out" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(212, 175, 55, 0.4), rgba(10, 25, 47, 0.95))", zIndex: 1 }} />
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.2) 100%)", zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: "1200px", padding: "100px 5% 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <div className="animateFadeUp delay1" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "8px 24px", borderRadius: "30px", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", backdropFilter: "blur(12px)", marginBottom: "40px", textTransform: "uppercase" }}>
          <GraduationCap size={18} color="var(--gold)" />
          Admissions Open 2026-27
        </div>
        
        <h1 className="font-heading animateFadeUp delay2" style={{ fontSize: "clamp(42px, 6vw, 84px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "32px", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          Nurturing Young Minds,<br/>
          <span style={{ color: "var(--gold)" }}>Building Bright Futures</span>
        </h1>
        
        <p className="animateFadeUp delay3" style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "rgba(255,255,255,0.85)", maxWidth: "800px", margin: "0 auto 50px", lineHeight: 1.7, fontWeight: 500 }}>
          {settings?.heroSubtitle || "Providing world-class education, strong values, and holistic development to help every child excel academically and personally in a rapidly changing world."}
        </p>
        
        <div className="animateFadeUp delay4" style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", marginBottom: "100px" }}>
          <a href="#contact" className={styles.btnPrimary} style={{ background: "var(--gold)", color: "var(--navy)", borderColor: "var(--gold)", padding: "18px 48px", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)" }}>
            Apply for Admission <ArrowRight size={20} />
          </a>
          <a href="#about" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "18px 48px", borderRadius: "30px", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, textDecoration: "none", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--navy)"; e.currentTarget.style.borderColor = "white"; }} onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}>
            Explore Campus
          </a>
        </div>

        {/* Stats Strip */}
        <div className="animateFadeUp delay5" style={{ display: "flex", gap: "clamp(30px, 8vw, 100px)", justifyContent: "center", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "50px", width: "100%", maxWidth: "1000px" }}>
          <div style={{ textAlign: "center" }}>
            <div className="font-heading" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, color: "var(--white)", marginBottom: "4px", textShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>1000<span style={{color: "var(--gold)"}}>+</span></div>
            <div style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Students</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="font-heading" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, color: "var(--white)", marginBottom: "4px", textShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>50<span style={{color: "var(--gold)"}}>+</span></div>
            <div style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Teachers</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="font-heading" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, color: "var(--white)", marginBottom: "4px", textShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>15<span style={{color: "var(--gold)"}}>+</span></div>
            <div style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Years Excellence</div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}
