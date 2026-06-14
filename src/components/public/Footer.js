import styles from "./public.module.css";
import { ChevronRight } from "lucide-react";

export default function Footer({ settings }) {
  return (
    <footer style={{ background: "var(--navy)", color: "var(--white)", padding: "80px 5% 30px", borderTop: "4px solid var(--gold)", position: "relative", overflow: "hidden" }}>
      {/* Background Accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(11, 30, 91, 0) 70%)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        
        {/* Logo & School Name */}
        <div style={{ marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)" }} />
          </div>
          <h3 className="font-heading" style={{ fontSize: "36px", marginBottom: "16px", color: "var(--white)", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            {settings?.schoolName || "SD Little Champ's E.M School"}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
            A Great Place To Learn. Empowering students with knowledge, values, and confidence for a brighter tomorrow.
          </p>
        </div>

        <div style={{ width: "60px", height: "2px", background: "rgba(255,255,255,0.1)", margin: "0 auto 40px" }} />

        {/* Quick Links Horizontal Strip */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", marginBottom: "50px" }}>
          <a href="#home" style={{ color: "var(--white)", textDecoration: "none", fontSize: "15px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }} onMouseOver={e => e.currentTarget.style.color = "var(--gold)"} onMouseOut={e => e.currentTarget.style.color = "var(--white)"}>Home</a>
          <a href="#about" style={{ color: "var(--white)", textDecoration: "none", fontSize: "15px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }} onMouseOver={e => e.currentTarget.style.color = "var(--gold)"} onMouseOut={e => e.currentTarget.style.color = "var(--white)"}>About</a>
          <a href="#facilities" style={{ color: "var(--white)", textDecoration: "none", fontSize: "15px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }} onMouseOver={e => e.currentTarget.style.color = "var(--gold)"} onMouseOut={e => e.currentTarget.style.color = "var(--white)"}>Facilities</a>
          <a href="#gallery" style={{ color: "var(--white)", textDecoration: "none", fontSize: "15px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }} onMouseOver={e => e.currentTarget.style.color = "var(--gold)"} onMouseOut={e => e.currentTarget.style.color = "var(--white)"}>Gallery</a>
          <a href="#contact" style={{ color: "var(--white)", textDecoration: "none", fontSize: "15px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }} onMouseOver={e => e.currentTarget.style.color = "var(--gold)"} onMouseOut={e => e.currentTarget.style.color = "var(--white)"}>Contact</a>
        </div>

        {/* Payment QR Box */}
        <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "24px 40px", display: "inline-block", marginBottom: "60px", backdropFilter: "blur(10px)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "var(--white)", fontSize: "12px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Fee Payment UPI</p>
          <p style={{ color: "var(--gold)", fontSize: "20px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px", wordBreak: "break-all" }}>
            {settings?.upiId || "0797714A0249484.bqr@kotak"}
          </p>
        </div>
      </div>

      {/* Copyright Strip */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "30px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
          © {new Date().getFullYear()} {settings?.schoolName || "SD Little Champ's"}. All Rights Reserved. Designed for excellence in education.
        </p>
      </div>
    </footer>
  );
}
