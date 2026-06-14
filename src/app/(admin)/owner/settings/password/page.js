"use client";
import { useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);
      setMessage("✅ Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div className="card">
        <h2 className="font-heading" style={{ marginBottom: "20px" }}>Change Account Password</h2>
        {message && (
          <div style={{ padding: "12px", background: message.includes("✅") ? "var(--green)" : "var(--red)", color: "white", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            {message}
          </div>
        )}
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="input-group">
            <label className="input-label">Current Password</label>
            <input type="password" className="input-field" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">New Password</label>
            <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength="6" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
