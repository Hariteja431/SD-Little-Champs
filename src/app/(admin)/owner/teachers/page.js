"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, secondaryAuth } from "@/lib/firebase";

export default function TeacherAccounts() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    assignedClass: ""
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uSnap = await getDocs(query(collection(db, "users"), where("role", "==", "teacher")));
      setTeachers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const cSnap = await getDocs(collection(db, "classes"));
      setClasses(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "users", editingId), {
          name: formData.name,
          assignedClass: formData.assignedClass
        });
        setMessage("✅ Teacher account updated successfully.");
        setEditingId(null);
      } else {
        // Create new
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          uid: uid,
          email: formData.email,
          name: formData.name,
          role: "teacher",
          assignedClass: formData.assignedClass,
          createdAt: new Date()
        });

        setMessage("✅ Teacher account created successfully.");
      }

      setFormData({ name: "", email: "", password: "", assignedClass: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
    setSaving(false);
  };

  const handleEditClick = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name || "",
      email: t.email || "",
      password: "", // Password cannot be edited here
      assignedClass: t.assignedClass || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", password: "", assignedClass: "" });
    setMessage("");
  };

  const handleDelete = async (id, email) => {
    if (confirm(`Remove access for ${email}? (This deletes their role from the database, but they must be deleted from Firebase Auth console for complete removal)`)) {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
      
      <div className="card" style={{ flex: "1", minWidth: "300px", position: "sticky", top: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="font-heading">{editingId ? "Edit Teacher" : "Create Teacher Login"}</h2>
          {editingId && <button className="btn btn-ghost" onClick={handleCancelEdit} style={{ padding: "4px 8px", fontSize: "12px" }}>Cancel Edit</button>}
        </div>
        
        {message && (
          <div style={{ padding: "12px", background: message.includes("✅") ? "var(--green)" : "var(--red)", color: "white", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSaveAccount} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="input-group">
            <label className="input-label">Teacher Name</label>
            <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address (Login ID)</label>
            <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={editingId !== null} style={{ background: editingId ? "var(--bg)" : "white" }} />
          </div>
          {!editingId && (
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="text" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength="6" />
            </div>
          )}
          {editingId && (
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              * Email and Password cannot be changed during edit. If password reset is needed, use the Firebase Auth console.
            </div>
          )}
          <div className="input-group">
            <label className="input-label">Assign Class (Optional)</label>
            <select className="input-field" value={formData.assignedClass} onChange={e => setFormData({...formData, assignedClass: e.target.value})}>
              <option value="">-- No Class Assigned --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            * Note: To link a teacher to a class fee structure, also update the "Teacher Email" field in Class Management.
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : (editingId ? "Update Account" : "Create Account")}
          </button>
        </form>
      </div>

      <div className="card" style={{ flex: "2", minWidth: "400px" }}>
        <h2 className="font-heading" style={{ marginBottom: "20px" }}>Active Teacher Accounts</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Assigned Class</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border)", background: editingId === t.id ? "rgba(245, 158, 11, 0.05)" : "transparent" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: "12px" }}>{t.email}</td>
                  <td style={{ padding: "12px" }}>{classes.find(c => c.id === t.assignedClass)?.name || "None"}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: "12px", border: "1px solid var(--border)" }} onClick={() => handleEditClick(t)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => handleDelete(t.id, t.email)}>Remove Access</button>
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && <tr><td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No teacher accounts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
