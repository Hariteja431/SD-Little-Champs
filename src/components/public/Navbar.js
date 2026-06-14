"use client";
import styles from "./public.module.css";
import { useEffect, useState } from "react";
import { X, Menu, UserCircle, ShieldCheck } from "lucide-react";

export default function Navbar({ settings, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use the prop function or a default if not provided
  const handlePrincipalLogin = () => onLoginClick && onLoginClick('principal');
  const handleTeacherLogin = () => onLoginClick && onLoginClick('teacher');

  return (
    <>
      {/* Navbar Overlay */}
      <nav 
        className={`${styles.navbar} ${styles.navbarScrolled}`}
        style={{ top: 0, height: "80px", background: "var(--white)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className={styles.logo}>
          <div style={{ width: "60px", height: "60px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo.png" alt="SD Little Champs Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 className="font-heading" style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "0.5px", color: "var(--navy)", lineHeight: 1.1 }}>
              SD Little Champ's<br/>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>E.M School</span>
            </h1>
          </div>
        </div>

        {/* Desktop Links & Actions */}
        <div className={`${styles.navLinks} no-mobile`} style={{ alignItems: "center" }}>
          <a href="#home" className={`${styles.navLink} ${styles.navLinkDark}`}>Home</a>
          <a href="#about" className={`${styles.navLink} ${styles.navLinkDark}`}>About</a>
          <a href="#achievements" className={`${styles.navLink} ${styles.navLinkDark}`}>Achievements</a>
          <a href="#facilities" className={`${styles.navLink} ${styles.navLinkDark}`}>Facilities</a>
          <a href="#gallery" className={`${styles.navLink} ${styles.navLinkDark}`}>Gallery</a>
          <a href="#contact" className={`${styles.navLink} ${styles.navLinkDark}`}>Contact</a>
          
          <div style={{ display: "flex", gap: "12px", marginLeft: "16px", paddingLeft: "16px", borderLeft: "1px solid rgba(0,0,0,0.1)" }}>
            <button onClick={handleTeacherLogin} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--navy)", color: "var(--navy)", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }} onMouseOver={e=>{e.currentTarget.style.background="var(--navy)"; e.currentTarget.style.color="var(--white)";}} onMouseOut={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--navy)";}}>
              <UserCircle size={16} /> Teachers
            </button>
            <button onClick={handlePrincipalLogin} style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--navy)", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
              <ShieldCheck size={16} /> Principal
            </button>
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button 
          className={`mobile-only ${styles.mobileMenuBtn}`}
          onClick={() => setMobileMenuOpen(true)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--navy)" }}
        >
          <Menu size={28} />
        </button>
      </nav>
      
      {/* Mobile Side Drawer */}
      {mobileMenuOpen && (
        <>
          <div className={styles.mobileDrawerOverlay} onClick={() => setMobileMenuOpen(false)} />
          <div className={styles.mobileDrawer}>
            <div className={styles.drawerHeader}>
              <div className={styles.logo}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", background: "white" }}>
                  <img src="/logo.png" alt="SD Little Champs Logo" style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.9)" }} />
                </div>
                <div>
                  <h1 className="font-heading" style={{ fontSize: "16px", color: "var(--navy)", lineHeight: 1.2 }}>SD Little Champ's</h1>
                </div>
              </div>
              <button className={styles.drawerClose} onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#achievements" onClick={() => setMobileMenuOpen(false)}>Hall of Fame</a>
            <a href="#facilities" onClick={() => setMobileMenuOpen(false)}>Facilities</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px" }}>
              <button onClick={() => { setMobileMenuOpen(false); handleTeacherLogin(); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--light-bg)", border: "1px solid rgba(0,0,0,0.1)", color: "var(--navy)", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
                <UserCircle size={18} /> Teacher Login
              </button>
              <button onClick={() => { setMobileMenuOpen(false); handlePrincipalLogin(); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--navy)", border: "none", color: "var(--white)", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
                <ShieldCheck size={18} /> Principal Login
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
