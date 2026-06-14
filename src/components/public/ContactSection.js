import styles from "./public.module.css";
import { MapPin, Phone, User, Mail, Send } from "lucide-react";

export default function ContactSection({ settings }) {
  return (
    <section id="contact" className={styles.ctaSection}>
      {/* Decorative background shapes */}
      <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "500px", height: "500px", background: "rgba(30, 58, 138, 0.4)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-50%", right: "-10%", width: "500px", height: "500px", background: "rgba(245, 158, 11, 0.2)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className={styles.sectionBadgeDark} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
            Get In Touch
          </div>
          <h2 style={{ fontSize: "48px", fontWeight: 800, marginBottom: "20px", color: "var(--white)", lineHeight: 1.2 }}>Start Your Journey With Us</h2>
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)", maxWidth: "700px", margin: "0 auto" }}>
            {settings?.admissionsBannerText || "Admissions are now open for Play School (Nursery) to Class 10. Contact us today to schedule a campus visit."}
          </p>
        </div>

        <div className={styles.grid2} style={{ alignItems: "center", gap: "60px" }}>
          {/* Left Side: Contact Details */}
          <div className={styles.glassCard} style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "24px", color: "var(--white)", fontWeight: 700, marginBottom: "30px" }}>Contact Information</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--gold)" }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "16px", color: "var(--white)", marginBottom: "4px" }}>Campus Address</strong>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{settings?.address || "Opp. Check Post, Balighatam, Narsipatnam, Andhra Pradesh"}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--gold)" }}>
                  <Phone size={24} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "16px", color: "var(--white)", marginBottom: "4px" }}>Phone Numbers</strong>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                    {settings?.phone1 || "79950 62636"} <br/>
                    {settings?.phone2 || "86885 95985"} <br/>
                    {settings?.phone3 || "93476 40085"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--gold)" }}>
                  <User size={24} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "16px", color: "var(--white)", marginBottom: "4px" }}>Correspondent</strong>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{settings?.correspondent || "M. Siva Prasad M.Sc, B.Ed"}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <a href={`tel:${settings?.phone1 || "7995062636"}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--gold)", color: "var(--navy)", padding: "14px 28px", borderRadius: "30px", fontWeight: 700, fontSize: "16px", textDecoration: "none", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                <Phone size={20} /> Call Now
              </a>
            </div>
          </div>

          {/* Right Side: Map Embed */}
          <div className={styles.mapEmbed} style={{ height: "450px" }}>
            <iframe 
              src={settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30501.55877840131!2d82.59972!3d17.6749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3a41bf3721345d%3A0x6b63795b215fa1d7!2sNarsipatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
