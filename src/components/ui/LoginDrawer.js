"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { X, Eye, EyeOff } from "lucide-react";
import styles from "./LoginDrawer.module.css";
import { useRouter } from "next/navigation";

export default function LoginDrawer({ isOpen, onClose, defaultTab = "owner" }) {
  const [tab, setTab] = useState(defaultTab); // "owner" or "teacher"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await verifyRoleAndRedirect(userCred.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCred = await signInWithPopup(auth, provider);
      await verifyRoleAndRedirect(userCred.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const verifyRoleAndRedirect = async (user) => {
    // Check Firestore for user role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    let userRole = null;

    if (userDoc.exists()) {
      userRole = userDoc.data().role;
    } else {
      // If no user doc, maybe it's the owner's first login (matches school settings email)
      const settingsDoc = await getDoc(doc(db, "settings", "school"));
      if (settingsDoc.exists() && settingsDoc.data().ownerEmail === user.email) {
        userRole = "owner";
        // In a real app we'd create the user doc here, but for now we assume they have access
        // We'll let the dashboard create it if missing
      }
    }

    if (tab === "owner" && userRole === "owner") {
      onClose();
      router.push("/owner");
    } else if (tab === "teacher" && userRole === "teacher") {
      onClose();
      router.push("/teacher");
    } else {
      // Wrong role for tab
      await auth.signOut();
      setError(`Unauthorized: Not a valid ${tab} account.`);
    }
  };

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} onClick={onClose} />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2 className="font-heading">School Login</h2>
          <p className="text-muted">Access your dashboard</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "owner" ? styles.active : ""}`}
            onClick={() => setTab("owner")}
          >
            Owner
          </button>
          <button
            className={`${styles.tab} ${tab === "teacher" ? styles.active : ""}`}
            onClick={() => setTab("teacher")}
          >
            Teacher
          </button>
        </div>

        <form className={styles.form} onSubmit={handleEmailLogin}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {loading ? (
              <>
                <svg className="animate-spin" style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : "Login with Email"}
          </button>
        </form>

        {tab === "owner" && (
          <div className={styles.googleAuth}>
            <div className={styles.divider}>
              <span>OR</span>
            </div>
            <button
              className={`btn btn-ghost ${styles.googleBtn}`}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </>
  );
}
