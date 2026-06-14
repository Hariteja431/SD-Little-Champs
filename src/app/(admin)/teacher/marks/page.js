"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { Printer } from "lucide-react";
import ReportCardPrintView from "@/components/admin/ReportCardPrintView";

export default function SubmitMarks() {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [exam, setExam] = useState("FA1");
  const [subjectsStr, setSubjectsStr] = useState("Telugu, Hindi, English, Maths, Science, Social");
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (userData?.assignedClass) {
        const snap = await getDocs(query(collection(db, "students"), where("classId", "==", userData.assignedClass), where("isActive", "==", true)));
        const stuList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        stuList.sort((a,b) => a.name.localeCompare(b.name));
        setStudents(stuList);

        // Pre-fill existing marks if any
        const mSnap = await getDocs(query(collection(db, "marks"), where("classId", "==", userData.assignedClass), where("examType", "==", exam)));
        if (!mSnap.empty) {
          const mData = mSnap.docs[0].data();
          if (mData.subjects) setSubjectsStr(mData.subjects.join(", "));
          
          const map = {};
          mData.records.forEach(r => {
            map[r.id] = r.marks;
          });
          setMarks(map);
        } else {
          // Init empty
          const initial = {};
          stuList.forEach(s => initial[s.id] = {});
          setMarks(initial);
        }
      }
      setLoading(false);
    };
    if (userData) fetchStudents();
  }, [userData, exam]);

  const handleMarkChange = (studentId, subject, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: Number(value) || 0
      }
    }));
  };

  const calculateGrade = (total) => {
    // Basic logic
    if (total >= 90) return "A+";
    if (total >= 80) return "A";
    if (total >= 70) return "B";
    if (total >= 60) return "C";
    if (total >= 50) return "D";
    return "Fail";
  };

  const handleSubmit = async () => {
    if (!confirm(`Submit marks for ${exam}? This will overwrite existing marks.`)) return;
    setSaving(true);
    
    try {
      const subjects = subjectsStr.split(",").map(s => s.trim()).filter(s => s);
      
      let records = students.map(s => {
        const stuMarks = marks[s.id] || {};
        let total = 0;
        subjects.forEach(sub => total += (stuMarks[sub] || 0));
        return {
          id: s.id,
          name: s.name,
          pin: s.pin,
          marks: stuMarks,
          total,
          grade: calculateGrade((total / (subjects.length * 100)) * 100) // Assuming max 100 per sub
        };
      });

      // Assign Rank
      records.sort((a, b) => b.total - a.total);
      records.forEach((r, i) => r.rank = i + 1);

      const docId = `${userData.assignedClass}_${exam}`;
      await setDoc(doc(db, "marks", docId), {
        classId: userData.assignedClass,
        className: students[0]?.className || "Unknown",
        examType: exam,
        subjects,
        records,
        submittedBy: userData.uid,
        updatedAt: serverTimestamp()
      });

      alert("Marks submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting marks.");
    }
    setSaving(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div>Loading...</div>;

  const subjectsArr = subjectsStr.split(",").map(s => s.trim()).filter(s => s);
  const classNameStr = students[0]?.className || userData?.assignedClass || "Class";

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div className="no-print">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Submit Marks</h1>
          {students.length > 0 && (
            <button className="btn btn-ghost" onClick={handlePrint}>
              <Printer size={18} /> Print Report Cards
            </button>
          )}
        </div>

        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="input-group" style={{ flex: 1, minWidth: "150px" }}>
              <label className="input-label">Exam Type</label>
              <select className="input-field" value={exam} onChange={e => {setLoading(true); setExam(e.target.value);}}>
                {["FA1", "FA2", "SA1", "FA3", "FA4", "SA2"].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ flex: 2, minWidth: "250px" }}>
              <label className="input-label">Subjects (comma separated)</label>
              <input type="text" className="input-field" value={subjectsStr} onChange={e => setSubjectsStr(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", whiteSpace: "nowrap" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "2px solid var(--border)", color: "var(--navy)" }}>
                <th style={{ padding: "12px" }}>Student Name</th>
                {subjectsArr.map(sub => <th key={sub} style={{ padding: "12px" }}>{sub}</th>)}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{s.name} <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "normal" }}>{s.pin}</div></td>
                  {subjectsArr.map(sub => (
                    <td key={sub} style={{ padding: "12px" }}>
                      <input 
                        type="number" 
                        className="input-field" 
                        style={{ width: "80px", padding: "8px" }} 
                        value={marks[s.id]?.[sub] || ""} 
                        onChange={e => handleMarkChange(s.id, sub, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {students.length > 0 && (
            <div style={{ padding: "16px", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Submitting..." : `Publish ${exam} Marks`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden print view */}
      {!loading && students.length > 0 && (
        <ReportCardPrintView 
          students={students} 
          marks={marks} 
          exam={exam} 
          className={classNameStr} 
          subjectsArr={subjectsArr} 
          calculateGrade={calculateGrade} 
        />
      )}
    </div>
  );
}
