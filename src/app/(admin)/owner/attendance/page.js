"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function AttendanceOverview() {
  const { userData } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const snap = await getDocs(collection(db, "classes"));
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchClasses();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedClass || !date) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      // 1. Fetch Students
      const snap = await getDocs(query(collection(db, "students"), where("classId", "==", selectedClass), where("isActive", "==", true)));
      const stuList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      stuList.sort((a,b) => a.name.localeCompare(b.name));
      setStudents(stuList);

      // 2. Fetch existing attendance
      const attSnap = await getDocs(query(collection(db, "attendance"), where("classId", "==", selectedClass), where("dateStr", "==", date)));
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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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

      const attId = `${selectedClass}_${date}`;
      const className = classes.find(c => c.id === selectedClass)?.name || "Unknown";
      
      await setDoc(doc(db, "attendance", attId), {
        classId: selectedClass,
        className: className,
        dateStr: date,
        createdAt: serverTimestamp(),
        submittedBy: userData?.uid || "owner",
        presentCount,
        absentCount,
        records
      });

      alert("Attendance saved successfully.");
      setAlreadySubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
    setSaving(false);
  };

  if (loading && classes.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Manage Attendance</h1>

      <div className="card" style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="input-group" style={{ flex: 1, minWidth: "150px" }}>
            <label className="input-label">Date</label>
            <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="input-label">Class</label>
            <select className="input-field" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
              <option value="">-- Select Class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }}>Load Records</button>
        </form>
      </div>

      {loading && hasSearched && <div>Loading records...</div>}

      {!loading && hasSearched && students.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
          No students found in this class.
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="card">
          {alreadySubmitted && (
            <div style={{ background: "var(--bg)", padding: "12px", borderRadius: "8px", marginBottom: "16px", color: "var(--navy)", fontWeight: 600 }}>
              Attendance has been previously submitted for this date. You can modify and update it below.
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

          <button className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "18px", marginTop: "24px" }} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : (alreadySubmitted ? "Update Attendance" : "Submit Attendance")}
          </button>
        </div>
      )}
    </div>
  );
}
