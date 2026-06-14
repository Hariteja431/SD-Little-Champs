"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);

  const CLASS_ORDER = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

  useEffect(() => {
    // We should seed classes if they don't exist, but here we just listen.
    // Assuming First-Time setup or a script seeds them. If not, we could seed them here.
    const q = query(collection(db, "classes"));
    const unsub = onSnapshot(q, (snapshot) => {
      let clsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort logically
      clsData.sort((a, b) => CLASS_ORDER.indexOf(a.name) - CLASS_ORDER.indexOf(b.name));
      setClasses(clsData);
      setLoading(false);
    });

    // Fetch student counts per class
    const fetchCounts = async () => {
      const snap = await getDocs(collection(db, "students"));
      const counts = {};
      snap.forEach(d => {
        const cId = d.data().classId;
        counts[cId] = (counts[cId] || 0) + 1;
      });
      setStudentCounts(counts);
    };
    fetchCounts();

    return () => unsub();
  }, []);

  const handleSeedClasses = async () => {
    const promises = CLASS_ORDER.map((name, index) => {
      const id = name.replace(/\s+/g, '').toLowerCase();
      return setDoc(doc(db, "classes", id), {
        name,
        isActive: true,
        annualTuition: 0,
        term1Fee: 0,
        term2Fee: 0,
        term3Fee: 0,
        hostelFeePerMonth: 0,
        booksFee: 0,
        teacherEmail: "",
        teacherPassword: ""
      });
    });
    await Promise.all(promises);
    alert("Classes seeded successfully!");
  };

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, "classes", id), { isActive: !current });
  };

  const handleSaveFeeStructure = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToUpdate } = editingClass;
      
      dataToUpdate.annualTuition = Number(dataToUpdate.annualTuition) || 0;
      dataToUpdate.term1Fee = Number(dataToUpdate.term1Fee) || 0;
      dataToUpdate.term2Fee = Number(dataToUpdate.term2Fee) || 0;
      dataToUpdate.term3Fee = Number(dataToUpdate.term3Fee) || 0;
      dataToUpdate.hostelFeePerMonth = Number(dataToUpdate.hostelFeePerMonth) || 0;
      dataToUpdate.booksFee = Number(dataToUpdate.booksFee) || 0;

      await updateDoc(doc(db, "classes", id), dataToUpdate);
      setEditingClass(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save fee structure.");
    }
  };

  if (loading) return <div>Loading classes...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Class Management & Fee Structure</h1>
        {classes.length === 0 && <button className="btn btn-primary" onClick={handleSeedClasses}>Seed Default Classes</button>}
      </div>

      {!editingClass ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {classes.map(cls => (
            <div key={cls.id} className="card" style={{ opacity: cls.isActive ? 1 : 0.6, borderLeft: `4px solid ${cls.isActive ? "var(--green)" : "var(--muted)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="font-heading" style={{ fontSize: "20px", color: "var(--navy)" }}>{cls.name}</h3>
                <span style={{ fontSize: "12px", background: "var(--bg)", padding: "4px 8px", borderRadius: "12px", fontWeight: 600 }}>
                  {studentCounts[cls.id] || 0} Students
                </span>
              </div>
              
              <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>Annual Tuition: <strong style={{ color: "var(--text)" }}>₹{cls.annualTuition || 0}</strong></div>
                <div>Teacher: <strong style={{ color: "var(--text)" }}>{cls.teacherEmail || "Not Assigned"}</strong></div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  className="btn btn-ghost" 
                  style={{ flex: 1, padding: "8px", fontSize: "14px", border: "1px solid var(--border)" }}
                  onClick={() => setEditingClass(cls)}
                >
                  Edit Fees/Teacher
                </button>
                <button 
                  className="btn" 
                  style={{ background: cls.isActive ? "#fee2e2" : "#dcfce7", color: cls.isActive ? "var(--red)" : "var(--green)", padding: "8px 12px", borderRadius: "var(--radius-btn)" }}
                  onClick={() => toggleActive(cls.id, cls.isActive)}
                >
                  {cls.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 className="font-heading" style={{ color: "var(--navy)" }}>Edit {editingClass.name}</h2>
            <button className="btn btn-ghost" onClick={() => setEditingClass(null)}>Cancel</button>
          </div>
          
          <form onSubmit={handleSaveFeeStructure} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ background: "var(--bg)", padding: "16px", borderRadius: "8px", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Tuition Fees (₹)</h3>
              <div className="input-group">
                <label className="input-label">Annual Tuition</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" className="input-field" value={editingClass.annualTuition} onChange={e => setEditingClass({...editingClass, annualTuition: e.target.value === "" ? "" : Number(e.target.value)})} />
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    style={{ border: "1px solid var(--border)" }}
                    onClick={() => {
                      const annual = Number(editingClass.annualTuition) || 0;
                      const third = Math.floor(annual / 3);
                      setEditingClass({...editingClass, term1Fee: third, term2Fee: third, term3Fee: annual - (third*2)});
                    }}
                  >
                    Auto-Split (3 Terms)
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div className="input-group">
                  <label className="input-label">Term 1</label>
                  <input type="number" className="input-field" value={editingClass.term1Fee} onChange={e => setEditingClass({...editingClass, term1Fee: e.target.value === "" ? "" : Number(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Term 2</label>
                  <input type="number" className="input-field" value={editingClass.term2Fee} onChange={e => setEditingClass({...editingClass, term2Fee: e.target.value === "" ? "" : Number(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Term 3</label>
                  <input type="number" className="input-field" value={editingClass.term3Fee} onChange={e => setEditingClass({...editingClass, term3Fee: e.target.value === "" ? "" : Number(e.target.value)})} />
                </div>
              </div>
              {Number(editingClass.annualTuition || 0) !== (Number(editingClass.term1Fee || 0) + Number(editingClass.term2Fee || 0) + Number(editingClass.term3Fee || 0)) && (
                <div style={{ color: "var(--red)", fontSize: "12px", marginTop: "4px" }}>Warning: Term fees don't sum up to Annual Tuition.</div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="input-group">
                <label className="input-label">Hostel Fee (Per Month)</label>
                <input type="number" className="input-field" value={editingClass.hostelFeePerMonth !== undefined ? editingClass.hostelFeePerMonth : 0} onChange={e => setEditingClass({...editingClass, hostelFeePerMonth: e.target.value === "" ? "" : Number(e.target.value)})} />
              </div>
              <div className="input-group">
                <label className="input-label">Books Fee (Annual)</label>
                <input type="number" className="input-field" value={editingClass.booksFee !== undefined ? editingClass.booksFee : 0} onChange={e => setEditingClass({...editingClass, booksFee: e.target.value === "" ? "" : Number(e.target.value)})} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Teacher Assignment</h3>
              <div className="input-group">
                <label className="input-label">Teacher Email (Login ID)</label>
                <input type="email" className="input-field" value={editingClass.teacherEmail || ""} onChange={e => setEditingClass({...editingClass, teacherEmail: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Teacher Password</label>
                <input type="text" className="input-field" placeholder="Enter password for teacher login" value={editingClass.teacherPassword || ""} onChange={e => setEditingClass({...editingClass, teacherPassword: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "16px" }}>Save Configuration</button>
          </form>
        </div>
      )}
    </div>
  );
}
