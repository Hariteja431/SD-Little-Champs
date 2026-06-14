"use client";
import { useState } from "react";
import styles from "./public.module.css";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const localGalleryImages = [
  { id: "img1", url: "/gallery/Screenshot 2026-06-14 123659.png", caption: "Campus Activity" },
  { id: "img2", url: "/gallery/Screenshot 2026-06-14 123713.png", caption: "Students" },
  { id: "img3", url: "/gallery/Screenshot 2026-06-14 123725.png", caption: "Event" },
  { id: "img4", url: "/gallery/Screenshot 2026-06-14 123739.png", caption: "Classroom" },
  { id: "img5", url: "/gallery/Screenshot 2026-06-14 123757.png", caption: "Sports Day" },
  { id: "img6", url: "/gallery/Screenshot 2026-06-14 123809.png", caption: "Celebration" },
  { id: "img7", url: "/gallery/Screenshot 2026-06-14 123820.png", caption: "Dance Performance" },
  { id: "img8", url: "/gallery/Screenshot 2026-06-14 123832.png", caption: "Independence Day" },
  { id: "img9", url: "/gallery/Screenshot 2026-06-14 124109.png", caption: "School Assembly" },
  { id: "img10", url: "/gallery/Screenshot 2026-06-14 124120.png", caption: "Group Activity" },
  { id: "img11", url: "/gallery/Screenshot 2026-06-14 124133.png", caption: "Awards" },
  { id: "img12", url: "/gallery/Screenshot 2026-06-14 124143.png", caption: "Learning" },
  { id: "img13", url: "/gallery/Screenshot 2026-06-14 124156.png", caption: "Fun Time" }
];

export default function GallerySection({ gallery }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const activeGallery = gallery?.length > 0 ? gallery : localGalleryImages;

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev > 0 ? prev - 1 : activeGallery.length - 1)); };
  const showNext = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev < activeGallery.length - 1 ? prev + 1 : 0)); };

  return (
    <section id="gallery" className={styles.sectionLight}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>📸 GALLERY</div>
        <h2 className={styles.sectionTitle}>Moments at SD</h2>
        <p className={styles.sectionSubtitle}>
          Glimpses of campus life, activities, and special events.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "0 5%" }}>
        {activeGallery.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => openLightbox(index)}
            style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: "16px",
              flexGrow: 1,
              flexBasis: "300px",
              height: "280px",
              boxShadow: "var(--shadow-md)",
              cursor: "pointer",
            }}
          >
            <img 
              src={item.url} 
              alt={item.caption} 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} 
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            />
            <div style={{
              position: "absolute", inset: 0, 
              background: "linear-gradient(to top, rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.2))", 
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.4s ease"
            }}
            onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.previousSibling.style.transform = "scale(1.08)"; }}
            onMouseOut={e => { e.currentTarget.style.opacity = 0; e.currentTarget.previousSibling.style.transform = "scale(1)"; }}
            >
              <div style={{ transform: "translateY(20px)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Maximize2 color="var(--gold)" size={40} style={{ marginBottom: "12px" }} />
                <span style={{ color: "white", fontSize: "16px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>View Image</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={closeLightbox}><X size={32} /></button>
            <img src={activeGallery[lightboxIndex].url} alt={activeGallery[lightboxIndex].caption} />
            
            <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={showPrev}>
              <ChevronLeft size={32} />
            </button>
            <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={showNext}>
              <ChevronRight size={32} />
            </button>
            
            <div style={{ textAlign: "center", color: "white", marginTop: "16px", fontSize: "18px", fontWeight: 600 }}>
              {activeGallery[lightboxIndex].caption}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
