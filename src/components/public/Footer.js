import styles from "./public.module.css";
import { ChevronRight } from "lucide-react";

export default function Footer({ settings }) {
  return (
    <footer className={styles.footer}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "40px", marginBottom: "60px", maxWidth: "800px", margin: "0 auto 60px" }}>
        
        {/* Section 1: Brand & About */}
        <div>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", background: "white", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)" }} />
          </div>
          <h3 className="font-heading" style={{ fontSize: "32px", marginBottom: "16px", color: "var(--white)", fontWeight: 800 }}>
            {settings?.schoolName || "SD Little Champ's E.M School"}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 24px", fontSize: "16px" }}>
            {settings?.tagline || "Providing quality education, strong values, and holistic development to help every child excel academically and personally."}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <a href="#" style={{ color: "var(--white)", background: "rgba(255,255,255,0.1)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", fontWeight: "bold" }} onMouseOver={e=>e.currentTarget.style.background="var(--royal-blue)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>fb</a>
            <a href="#" style={{ color: "var(--white)", background: "rgba(255,255,255,0.1)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", fontWeight: "bold" }} onMouseOver={e=>e.currentTarget.style.background="var(--royal-blue)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>ig</a>
            <a href="#" style={{ color: "var(--white)", background: "rgba(255,255,255,0.1)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", fontWeight: "bold" }} onMouseOver={e=>e.currentTarget.style.background="var(--royal-blue)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>x</a>
            <a href="#" style={{ color: "var(--white)", background: "rgba(255,255,255,0.1)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s", fontWeight: "bold" }} onMouseOver={e=>e.currentTarget.style.background="var(--royal-blue)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>in</a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", width: "100%" }}>
          <a href="#home" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>Home</a>
          <a href="#about" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>About Us</a>
          <a href="#achievements" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>Our Pride</a>
          <a href="#facilities" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>Facilities</a>
          <a href="#gallery" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>Gallery</a>
          <a href="#contact" style={{ color: "var(--white)", textDecoration: "none", fontWeight: 600 }}>Contact</a>
        </div>

        {/* Section 3: Payment */}
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "24px 48px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "var(--white)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontWeight: 700 }}>Official UPI ID For Fee Payment</p>
          <p style={{ fontWeight: 700, color: "var(--gold)", wordBreak: "break-all", fontSize: "20px", letterSpacing: "1px" }}>{settings?.upiId || "0797714A0249484.bqr@kotak"}</p>
        </div>

      </div>

      {/* Copyright */}
      <div style={{ textAlign: "center", paddingTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p>{settings?.footerText || `© ${new Date().getFullYear()} ${settings?.schoolName || "SD Little Champ's E.M School"}. All rights reserved.`}</p>
        <p>Designed for excellence in education.</p>
      </div>
    </footer>
  );
}
