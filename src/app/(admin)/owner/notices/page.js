"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Edit2, Check, X } from "lucide-react";

export default function ManageNotices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "General",
    date: new Date().toISOString().split("T")[0],
    isPublic: true
  });

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddNotice = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "notices"), {
        ...formData,
        date: new Date(formData.date), // Convert string to Date
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });
      setFormData({ title: "", body: "", type: "General", date: new Date().toISOString().split("T")[0], isPublic: true });
    } catch (err) {
      console.error("Error adding notice:", err);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      await deleteDoc(doc(db, "notices", id));
    }
  };

  const togglePublic = async (id, currentStatus) => {
    await updateDoc(doc(db, "notices", id), { isPublic: !currentStatus });
  };

  if (loading) return <div>Loading notices...</div>;

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
      
      {/* Add Notice Form */}
      <div className="card" style={{ flex: "1", minWidth: "300px", position: "sticky", top: "24px" }}>
        <h2 className="font-heading" style={{ marginBottom: "20px" }}>Post New Notice</h2>
        <form onSubmit={handleAddNotice} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="input-group">
            <label className="input-label">Date</label>
            <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Type</label>
            <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Holiday">Holiday</option>
              <option value="Event">Event</option>
              <option value="Admission">Admission</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Body / Description</label>
            <textarea className="input-field" rows="4" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} required />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" id="isPublic" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} />
            <label htmlFor="isPublic" style={{ fontSize: "14px", fontWeight: 600 }}>Show on public website</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Posting..." : "Post Notice"}
          </button>
        </form>
      </div>

      {/* Notice List */}
      <div style={{ flex: "2", minWidth: "400px" }}>
        <h2 className="font-heading" style={{ marginBottom: "20px" }}>All Notices</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {notices.map(notice => (
            <div key={notice.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "12px", background: "var(--bg)", padding: "4px 8px", borderRadius: "4px", marginRight: "8px", fontWeight: 600 }}>
                    {typeof notice.date === 'string' 
                      ? new Date(notice.date).toLocaleDateString('en-GB') 
                      : notice.date?.toDate?.().toLocaleDateString('en-GB') || "N/A"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--navy)", fontWeight: 600, textTransform: "uppercase" }}>{notice.type}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => togglePublic(notice.id, notice.isPublic)}
                    title={notice.isPublic ? "Make Private" : "Make Public"}
                    style={{ background: "none", border: "none", color: notice.isPublic ? "var(--green)" : "var(--muted)", cursor: "pointer" }}
                  >
                    {notice.isPublic ? <Check size={18} /> : <X size={18} />}
                  </button>
                  <button onClick={() => handleDelete(notice.id)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer" }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-heading" style={{ fontSize: "18px" }}>{notice.title}</h3>
              <p className="text-muted" style={{ fontSize: "14px" }}>{notice.body}</p>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                Status: <strong style={{ color: notice.isPublic ? "var(--green)" : "var(--muted)" }}>{notice.isPublic ? "Public" : "Private"}</strong>
              </div>
            </div>
          ))}
          {notices.length === 0 && <div className="text-muted">No notices found.</div>}
        </div>
      </div>
    </div>
  );
}
