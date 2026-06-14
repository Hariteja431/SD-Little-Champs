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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", padding: "0 20px" }}>
        {activeGallery.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => openLightbox(index)}
            style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: "16px", 
              aspectRatio: "4/3",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              group: "true"
            }}
            className="gallery-item"
          >
            <img 
              src={item.url} 
              alt={item.caption} 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            />
            <div style={{
              position: "absolute", inset: 0, 
              background: "rgba(11, 30, 91, 0.4)", 
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.3s ease"
            }}
            onMouseOver={e => e.currentTarget.style.opacity = 1}
            onMouseOut={e => e.currentTarget.style.opacity = 0}
            >
              <Maximize2 color="white" size={40} />
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
