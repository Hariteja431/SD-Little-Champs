"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function WebsiteCMS() {
  const [data, setData] = useState({
    schoolName: "",
    tagline: "",
    correspondent: "",
    phone1: "", phone2: "", phone3: "",
    address: "",
    upiId: "",
    whatsappNumber: "",
    heroTitle: "",
    heroBadgeText: "",
    heroSubtitle: "",
    announcementTicker: "",
    aboutText: "",
    heroStats: { students: "", topScore: "", classes: "", teachers: "" },
    seoTitle: "",
    seoDescription: "",
    footerText: "",
    admissionsBannerText: "",
    mapEmbedUrl: "",
    logoUrl: "",
    heroSlides: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "school"));
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setData(prev => ({ ...prev, [parent]: { ...(prev[parent] || {}), [child]: value } }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    setMessage("Uploading image...");
    try {
      const storageRef = ref(storage, `website/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (field === "logoUrl") {
        setData(prev => ({ ...prev, logoUrl: url }));
      } else if (field === "heroSlides") {
        setData(prev => ({ ...prev, heroSlides: [...(prev.heroSlides || []), url] }));
      }
      setMessage("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const removeSlide = (index) => {
    const newSlides = [...data.heroSlides];
    newSlides.splice(index, 1);
    setData(prev => ({ ...prev, heroSlides: newSlides }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("Saving changes...");
    try {
      await setDoc(doc(db, "settings", "school"), data, { merge: true });
      setMessage("✅ Website updated! Changes are live.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving changes.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) return <div>Loading CMS...</div>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Edit Website Content</h1>
        {message && <div style={{ background: message.includes("❌") ? "var(--red)" : "var(--green)", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>{message}</div>}
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>General Info</h2>
          <div className="input-group">
            <label className="input-label">School Name</label>
            <input type="text" className="input-field" name="schoolName" value={data.schoolName || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Tagline</label>
            <input type="text" className="input-field" name="tagline" value={data.tagline || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Correspondent</label>
            <input type="text" className="input-field" name="correspondent" value={data.correspondent || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Logo Upload (Current: {data.logoUrl ? "Set" : "None"})</label>
            <input type="file" className="input-field" accept="image/*" onChange={(e) => handleImageUpload(e, "logoUrl")} />
            {data.logoUrl && <img src={data.logoUrl} alt="Logo Preview" style={{ width: "80px", marginTop: "10px", borderRadius: "8px" }} />}
          </div>
        </div>

        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Hero Section</h2>
          <div className="input-group">
            <label className="input-label">Hero Badge Text</label>
            <input type="text" className="input-field" name="heroBadgeText" value={data.heroBadgeText || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Hero Title</label>
            <input type="text" className="input-field" name="heroTitle" value={data.heroTitle || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Hero Subtitle</label>
            <input type="text" className="input-field" name="heroSubtitle" value={data.heroSubtitle || ""} onChange={handleChange} />
          </div>
          
          <div className="input-group" style={{ marginTop: "16px" }}>
            <label className="input-label">Hero Slideshow Images</label>
            <input type="file" className="input-field" accept="image/*" onChange={(e) => handleImageUpload(e, "heroSlides")} />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              {(data.heroSlides || []).map((slide, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img src={slide} alt="Slide" style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                  <button type="button" onClick={() => removeSlide(idx)} style={{ position: "absolute", top: -5, right: -5, background: "red", color: "white", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px" }}>X</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Hero Stats</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group"><label className="input-label">Students</label><input type="text" className="input-field" name="heroStats.students" value={data.heroStats?.students || ""} onChange={handleChange} /></div>
            <div className="input-group"><label className="input-label">Top Score</label><input type="text" className="input-field" name="heroStats.topScore" value={data.heroStats?.topScore || ""} onChange={handleChange} /></div>
            <div className="input-group"><label className="input-label">Classes</label><input type="text" className="input-field" name="heroStats.classes" value={data.heroStats?.classes || ""} onChange={handleChange} /></div>
            <div className="input-group"><label className="input-label">Teachers</label><input type="text" className="input-field" name="heroStats.teachers" value={data.heroStats?.teachers || ""} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Content & Announcements</h2>
          <div className="input-group">
            <label className="input-label">Announcement Ticker</label>
            <input type="text" className="input-field" name="announcementTicker" value={data.announcementTicker || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">About Us Text</label>
            <textarea className="input-field" rows="4" name="aboutText" value={data.aboutText || ""} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Admissions Banner Text</label>
            <input type="text" className="input-field" name="admissionsBannerText" value={data.admissionsBannerText || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Contact Details</h2>
          <div className="input-group"><label className="input-label">Phone 1</label><input type="text" className="input-field" name="phone1" value={data.phone1 || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">Phone 2</label><input type="text" className="input-field" name="phone2" value={data.phone2 || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">Phone 3</label><input type="text" className="input-field" name="phone3" value={data.phone3 || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">WhatsApp Number (with country code)</label><input type="text" className="input-field" name="whatsappNumber" value={data.whatsappNumber || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">UPI ID</label><input type="text" className="input-field" name="upiId" value={data.upiId || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">Address</label><textarea className="input-field" rows="2" name="address" value={data.address || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">Google Maps Embed URL</label><input type="text" className="input-field" name="mapEmbedUrl" value={data.mapEmbedUrl || ""} onChange={handleChange} /></div>
        </div>

        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>SEO & Footer</h2>
          <div className="input-group"><label className="input-label">SEO Title</label><input type="text" className="input-field" name="seoTitle" value={data.seoTitle || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">SEO Description</label><textarea className="input-field" rows="2" name="seoDescription" value={data.seoDescription || ""} onChange={handleChange} /></div>
          <div className="input-group"><label className="input-label">Footer Text</label><input type="text" className="input-field" name="footerText" value={data.footerText || ""} onChange={handleChange} /></div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "16px", fontSize: "18px" }} disabled={saving}>
          {saving ? "Saving..." : "Save Website Content"}
        </button>
      </form>
    </div>
  );
}
