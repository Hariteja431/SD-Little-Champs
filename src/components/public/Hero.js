"use client";
import styles from "./public.module.css";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function Hero({ settings }) {
  const heroImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="home" style={{ position: "relative", minHeight: "900px", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--light-bg)" }}>
      {/* Background Image on the right */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "top right", zIndex: 0 }} />
      
      {/* White Gradient Overlay (solid white on left fading to transparent on right) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0) 80%)", zIndex: 1 }} />
      <div className="mobile-only" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "180px 5% 200px", display: "flex", flexDirection: "column", alignItems: "flex-start", flexGrow: 1 }}>
        
        {/* Admission Badge */}
        <div className="animateFadeUp delay1" style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--gold)", padding: "10px 24px", borderRadius: "30px", fontSize: "14px", fontWeight: 700, letterSpacing: "1px", marginBottom: "30px", textTransform: "uppercase", color: "var(--navy)", background: "rgba(255,255,255,0.8)" }}>
          <GraduationCap size={18} color="var(--gold)" />
          Admissions Open 2026-27
        </div>
        
        <h1 className="font-heading animateFadeUp delay2" style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "24px", color: "var(--navy)", maxWidth: "800px", textAlign: "left" }}>
          Nurturing Young Minds,<br/>
          <span style={{ color: "var(--gold)" }}>Building Bright Futures</span>
        </h1>
        
        <p className="animateFadeUp delay3" style={{ fontSize: "clamp(18px, 2vw, 20px)", color: "var(--text-muted)", maxWidth: "600px", marginBottom: "50px", lineHeight: 1.6, fontWeight: 500, textAlign: "left" }}>
          {settings?.heroSubtitle || "A place where curiosity grows, talents shine, and every child is inspired to achieve their best."}
        </p>
        
        <div className="animateFadeUp delay4" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <a href="#contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--gold)", color: "var(--navy)", padding: "16px 36px", borderRadius: "8px", fontSize: "16px", fontWeight: 700, textDecoration: "none", transition: "all 0.3s", boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)" }}>
            Apply for Admission <ArrowRight size={18} />
          </a>
          <a href="#about" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--white)", color: "var(--navy)", border: "1px solid var(--navy)", padding: "16px 36px", borderRadius: "8px", fontSize: "16px", fontWeight: 700, textDecoration: "none", transition: "all 0.3s" }} onMouseOver={e => { e.currentTarget.style.background = "var(--navy)"; e.currentTarget.style.color = "white"; }} onMouseOut={e => { e.currentTarget.style.background = "var(--white)"; e.currentTarget.style.color = "var(--navy)"; }}>
            Explore Our Campus <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Floating Stats Strip at the bottom */}
      <div className="animateFadeUp delay5" style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "1200px", background: "var(--white)", borderRadius: "24px", padding: "30px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", zIndex: 4 }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px", borderRight: "1px solid rgba(0,0,0,0.05)", paddingRight: "20px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--navy)" }}>1000+</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>Students</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", borderRight: "1px solid rgba(0,0,0,0.05)", paddingRight: "20px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--navy)" }}>50+</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>Teachers</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", borderRight: "1px solid rgba(0,0,0,0.05)", paddingRight: "20px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--navy)" }}>15+</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>Years Excellence</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)", color: "var(--white)", flexShrink: 0 }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy)" }}>Holistic Education</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", marginTop: "2px" }}>For Lifelong Success</div>
          </div>
        </div>

      </div>
      
    </section>
  );
}
