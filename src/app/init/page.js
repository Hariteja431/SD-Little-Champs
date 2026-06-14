"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

export default function InitDatabase() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("owner@sdchamps.com");
  const [password, setPassword] = useState("admin123");

  const handleInit = async () => {
    setLoading(true);
    setMessage("Initializing...");
    try {
      // 1. Create Owner Account
      let uid = "";
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCred.user.uid;
        setMessage("Created Auth User...");
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
           setMessage("Auth user exists, signing in to link role...");
           const { signInWithEmailAndPassword } = await import("firebase/auth");
           const userCred = await signInWithEmailAndPassword(auth, email, password);
           uid = userCred.user.uid;
        } else {
           throw err;
        }
      }

      // 2. Set Owner Role in DB
      if (uid) {
        await setDoc(doc(db, "users", uid), {
          uid: uid,
          email: email,
          name: "School Owner",
          role: "owner",
          createdAt: new Date()
        });
        setMessage("Set Owner Role in DB...");
      }

      // 3. Seed Settings
      await setDoc(doc(db, "settings", "school"), {
        schoolName: "SD Little Champ's English Medium School",
        address: "Narsipatnam",
        phone: "+91 9876543210",
        email: "info@sdchamps.com",
        announcementTicker: "Admissions Open for 2026-27! Register Now.",
        heroTitle: "Empowering Young Minds",
        heroSubtitle: "Quality education for a brighter future."
      });
      setMessage("Seeded Settings...");

      // 4. Seed Dummy Data
      await addDoc(collection(db, "notices"), {
        title: "Welcome to our new website",
        body: "We are excited to launch our new digital platform.",
        date: new Date().toISOString().split("T")[0],
        isPublic: true,
        createdAt: new Date()
      });

      await addDoc(collection(db, "facilities"), {
        title: "Modern Classrooms",
        description: "Equipped with digital learning tools.",
        icon: "🏫",
        order: 1
      });

      await addDoc(collection(db, "achievements"), {
        title: "100% Board Results",
        description: "Our 10th batch secured a 100% pass rate.",
        year: "2025"
      });

      setMessage("✅ Database successfully initialized! You can now go to localhost:3000 and log in.");
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%" }}>
        <h1 style={{ color: "#0d1b4b", marginBottom: "20px" }}>Database Setup</h1>
        <p style={{ color: "#64748b", marginBottom: "20px", lineHeight: "1.5" }}>
          Your code is successfully connected to Firebase, but your Firestore database is currently empty. Click the button below to seed it with the necessary schema and create your Owner account.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>Owner Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>Owner Password</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }} />
        </div>

        <button 
          onClick={handleInit} 
          disabled={loading}
          style={{ width: "100%", padding: "15px", background: "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          {loading ? "Seeding Database..." : "Initialize Database"}
        </button>

        {message && (
          <div style={{ marginTop: "20px", padding: "15px", background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: "6px", color: message.includes("❌") ? "red" : "#0f172a" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
