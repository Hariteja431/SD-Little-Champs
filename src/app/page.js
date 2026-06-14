"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, collection, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import AnnouncementTicker from "@/components/public/AnnouncementTicker";
import AboutSection from "@/components/public/AboutSection";
import AchievementsSection from "@/components/public/AchievementsSection";
import GallerySection from "@/components/public/GallerySection";
import FacilitiesSection from "@/components/public/FacilitiesSection";
import NoticesSection from "@/components/public/NoticesSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import LoginDrawer from "@/components/ui/LoginDrawer";

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [whyUs, setWhyUs] = useState([]);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);

  useEffect(() => {
    // Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "school"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      } else {
        // Provide fallback settings if DB is empty
        setSettings({
          schoolName: "SD Little Champ's English Medium School",
          address: "Narsipatnam",
          phone: "",
          email: "",
          announcementTicker: "Welcome to SD Little Champ's English Medium School!",
          heroTitle: "Empowering Young Minds",
          heroSubtitle: "Quality education for a brighter future."
        });
      }
    });

    // Public Notices
    const qNotices = query(
      collection(db, "notices"),
      orderBy("date", "desc"),
      limit(20)
    );
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      const publicNotices = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(notice => notice.isPublic)
        .slice(0, 5);
      setNotices(publicNotices);
    });

    // Gallery
    const qGallery = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"), limit(20));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Achievements
    const qAchievements = query(collection(db, "achievements"));
    const unsubAchievements = onSnapshot(qAchievements, (snapshot) => {
      setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Facilities
    const qFacilities = query(collection(db, "facilities"), orderBy("order", "asc"));
    const unsubFacilities = onSnapshot(qFacilities, (snapshot) => {
      setFacilities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Why Us
    const qWhyUs = query(collection(db, "whyUs"), orderBy("order", "asc"));
    const unsubWhyUs = onSnapshot(qWhyUs, (snapshot) => {
      setWhyUs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSettings();
      unsubNotices();
      unsubGallery();
      unsubAchievements();
      unsubFacilities();
      unsubWhyUs();
    };
  }, []);

  if (!settings) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{
          width: "50px", height: "50px", border: "5px solid #f3f3f3",
          borderTop: "5px solid var(--navy)", borderRadius: "50%", animation: "spin 1s linear infinite"
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <Navbar settings={settings} onLoginClick={() => setIsLoginDrawerOpen(true)} />
      <Hero settings={settings} />
      <AnnouncementTicker text={settings.announcementTicker} />
      <AboutSection settings={settings} whyUs={whyUs} />
      <AchievementsSection achievements={achievements} />
      <GallerySection gallery={gallery} />
      <FacilitiesSection facilities={facilities} />
      <NoticesSection notices={notices} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />

      {/* WhatsApp FAB */}
      {settings.whatsappNumber && (
        <a 
          href={`https://wa.me/${settings.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed", bottom: "30px", right: "30px", background: "#25D366", color: "white",
            width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)", zIndex: 50, fontSize: "30px"
          }}
        >
          📱
        </a>
      )}

      <LoginDrawer isOpen={isLoginDrawerOpen} onClose={() => setIsLoginDrawerOpen(false)} />
    </>
  );
}
