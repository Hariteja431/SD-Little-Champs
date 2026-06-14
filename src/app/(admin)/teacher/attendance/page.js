"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function MarkAttendance() {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (userData?.assignedClass) {
        const snap = await getDocs(query(collection(db, "students"), where("classId", "==", userData.assignedClass), where("isActive", "==", true)));
        const stuList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by name
        stuList.sort((a,b) => a.name.localeCompare(b.name));
        setStudents(stuList);
        
        // Check if attendance already marked for today
        const attSnap = await getDocs(query(collection(db, "attendance"), where("classId", "==", userData.assignedClass), where("dateStr", "==", dateStr)));
        if (!attSnap.empty) {
          setAlreadySubmitted(true);
          const existing = attSnap.docs[0].data();
          const map = {};
          existing.records.forEach(r => map[r.id] = r.status);
          setAttendance(map);
        } else {
          setAlreadySubmitted(false);
          const initial = {};
          stuList.forEach(s => initial[s.id] = "Present"); // Default all Present
          setAttendance(initial);
        }
      }
      setLoading(false);
    };
    if (userData) fetchStudents();
  }, [userData, dateStr]);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present"
    }));
  };

  const handleSubmit = async () => {
    if (!confirm(alreadySubmitted ? "Update this attendance record?" : "Are you sure you want to submit attendance?")) return;
    setSaving(true);
    try {
      const records = students.map(s => ({
        id: s.id,
        name: s.name,
        pin: s.pin,
        status: attendance[s.id]
      }));

      const presentCount = records.filter(r => r.status === "Present").length;
      const absentCount = records.filter(r => r.status === "Absent").length;

      const attId = `${userData.assignedClass}_${dateStr}`;
      
      await setDoc(doc(db, "attendance", attId), {
        classId: userData.assignedClass,
        className: students[0]?.className || "Unknown",
        dateStr,
        createdAt: serverTimestamp(),
        submittedBy: userData.uid,
        presentCount,
        absentCount,
        records
      });

      alert("Attendance submitted successfully.");
      setAlreadySubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting attendance");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Mark Attendance</h1>
        <input type="date" className="input-field" value={dateStr} onChange={e => setDateStr(e.target.value)} style={{ width: "auto" }} />
      </div>

      <div className="card">
        {alreadySubmitted && (
          <div style={{ background: "var(--bg)", padding: "12px", borderRadius: "8px", marginBottom: "16px", color: "var(--navy)", fontWeight: 600 }}>
            Attendance already submitted for this date. You can modify and update it below.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
          {students.map(s => (
            <div 
              key={s.id} 
              onClick={() => toggleAttendance(s.id)}
              style={{ 
                border: "1px solid var(--border)", 
                padding: "16px", 
                borderRadius: "8px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer",
                background: attendance[s.id] === "Present" ? "#dcfce7" : "#fee2e2",
                borderColor: attendance[s.id] === "Present" ? "var(--green)" : "var(--red)"
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "var(--navy)" }}>{s.name}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>{s.pin}</div>
              </div>
              <div style={{ fontWeight: "bold", color: attendance[s.id] === "Present" ? "var(--green)" : "var(--red)" }}>
                {attendance[s.id]}
              </div>
            </div>
          ))}
        </div>

        {students.length > 0 && (
          <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "18px", marginTop: "24px" }} onClick={handleSubmit} disabled={saving}>
            {saving ? "Submitting..." : (alreadySubmitted ? "Update Attendance" : "Submit Attendance")}
          </button>
        )}
      </div>
    </div>
  );
}
