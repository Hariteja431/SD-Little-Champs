import styles from "./public.module.css";
import { MapPin, Phone, Mail, ChevronRight, GraduationCap } from "lucide-react";

export default function Footer({ settings }) {
  return (
    <footer style={{ background: "var(--navy-light)", color: "var(--white)", paddingTop: "80px", borderTop: "4px solid var(--gold)", position: "relative", overflow: "hidden" }}>
      {/* Background Accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "400px", height: "400px", background: "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 5%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "60px", paddingBottom: "60px" }}>
        
        {/* Brand Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", background: "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
              <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)" }} />
            </div>
            <h3 className="font-heading" style={{ fontSize: "24px", color: "var(--white)", fontWeight: 800, lineHeight: 1.2 }}>
              SD Little<br/>Champ's
            </h3>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.8, marginBottom: "24px" }}>
            A Great Place To Learn. Empowering students with knowledge, values, and confidence for a brighter tomorrow.
          </p>
          
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Secure Fee Payment UPI</p>
            <p style={{ color: "var(--gold)", fontSize: "14px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px", wordBreak: "break-all" }}>
              {settings?.upiId || "0797714A0249484.bqr@kotak"}
            </p>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-heading" style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--white)" }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {['Home', 'About', 'Achievements', 'Facilities', 'Gallery', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "15px", transition: "color 0.3s, transform 0.3s" }} onMouseOver={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = "translateX(5px)"; }} onMouseOut={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <ChevronRight size={16} color="var(--gold)" /> {link}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-heading" style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--white)" }}>Contact Us</h4>
          
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <MapPin size={24} color="var(--gold)" style={{ flexShrink: 0, marginTop: "4px" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6 }}>
              Opp. Check Post, Balighatam,<br/>
              Narsipatnam, Andhra Pradesh
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <Phone size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6 }}>
              79950 62636 <br/>
              86885 95985 <br/>
              93476 40085
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "16px" }}>
            <GraduationCap size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6 }}>
              <span style={{ display: "block", color: "var(--white)", fontWeight: 600, fontSize: "13px" }}>Correspondent</span>
              M. Siva Prasad M.Sc, B.Ed
            </p>
          </div>

        </div>
      </div>

      {/* Copyright Strip */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(0,0,0,0.2)", padding: "24px 5%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
          © {new Date().getFullYear()} {settings?.schoolName || "SD Little Champ's E.M School"}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
