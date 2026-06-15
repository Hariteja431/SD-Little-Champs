"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import * as XLSX from "xlsx";

import { Printer } from "lucide-react";
import ReportCardPrintView from "@/components/admin/ReportCardPrintView";

export default function MarksManagement() {
  const { userData } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [exam, setExam] = useState("FA1");
  const [subjectsStr, setSubjectsStr] = useState("Telugu, Hindi, English, Maths, Science, Social");
  
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
    if (!selectedClass || !exam) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch students for this class
      const snap = await getDocs(query(collection(db, "students"), where("classId", "==", selectedClass), where("isActive", "==", true)));
      const stuList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      stuList.sort((a,b) => a.name.localeCompare(b.name));
      setStudents(stuList);

      // Fetch existing marks
      const mSnap = await getDocs(query(collection(db, "marks"), where("classId", "==", selectedClass), where("examType", "==", exam)));
      if (!mSnap.empty) {
        const mData = mSnap.docs[0].data();
        if (mData.subjects) setSubjectsStr(mData.subjects.join(", "));
        
        const map = {};
        mData.records.forEach(r => {
          map[r.id] = r.marks;
        });
        setMarks(map);
      } else {
        const initial = {};
        stuList.forEach(s => initial[s.id] = {});
        setMarks(initial);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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
          grade: calculateGrade((total / (subjects.length * 100)) * 100)
        };
      });

      records.sort((a, b) => b.total - a.total);
      records.forEach((r, i) => r.rank = i + 1);

      const className = classes.find(c => c.id === selectedClass)?.name || "Unknown";
      const docId = `${selectedClass}_${exam}`;
      
      const payload = {
        classId: selectedClass,
        className,
        examType: exam,
        subjects,
        records,
        updatedAt: serverTimestamp()
      };
      if (userData?.uid) payload.submittedBy = userData.uid;

      await setDoc(doc(db, "marks", docId), payload);
      alert("Marks submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting marks.");
    }
    setSaving(false);
  };

  const handleExport = () => {
    if (students.length === 0) return;
    const subjects = subjectsStr.split(",").map(s => s.trim()).filter(s => s);
    
    // Sort students by total for ranking
    const recordsForExport = students.map(s => {
      const stuMarks = marks[s.id] || {};
      let total = 0;
      subjects.forEach(sub => total += (stuMarks[sub] || 0));
      return { pin: s.pin, name: s.name, marks: stuMarks, total, grade: calculateGrade((total / (subjects.length * 100)) * 100) };
    });
    
    recordsForExport.sort((a, b) => b.total - a.total);
    recordsForExport.forEach((r, i) => r.rank = i + 1);

    const rows = recordsForExport.map(r => {
      const row = { Rank: r.rank, PIN: r.pin, Name: r.name };
      subjects.forEach(sub => {
        row[sub] = r.marks[sub] || "-";
      });
      row["Total"] = r.total;
      row["Grade"] = r.grade;
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks");
    
    const className = classes.find(c => c.id === selectedClass)?.name || "Class";
    XLSX.writeFile(wb, `${className}_${exam}_Marks.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const subjectsArr = subjectsStr.split(",").map(s => s.trim()).filter(s => s);
  const className = classes.find(c => c.id === selectedClass)?.name || "Class";

  return (
    <div>
      <div className="no-print">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Post Marks</h1>
          {students.length > 0 && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-ghost" onClick={handlePrint}>
                <Printer size={18} /> Print Report Cards
              </button>
              <button className="btn btn-primary" onClick={handleExport}>Export to Excel</button>
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: "24px" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="input-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="input-label">Class</label>
            <select className="input-field" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
              <option value="">-- Select Class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: "150px" }}>
            <label className="input-label">Exam Type</label>
            <input 
              list="exam-types" 
              className="input-field" 
              value={exam} 
              onChange={e => setExam(e.target.value)} 
              placeholder="e.g. FA1 or Custom"
              required
            />
            <datalist id="exam-types">
              {["FA1", "FA2", "SA1", "FA3", "FA4", "SA2"].map(e => <option key={e} value={e} />)}
            </datalist>
          </div>
          <div className="input-group" style={{ flex: 2, minWidth: "300px" }}>
            <label className="input-label">Subjects (comma separated)</label>
            <input type="text" className="input-field" value={subjectsStr} onChange={e => setSubjectsStr(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }}>Load Students</button>
        </form>
      </div>

      {loading && hasSearched && <div>Loading records...</div>}

      {!loading && hasSearched && students.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
          No students found in this class.
        </div>
      )}

      {!loading && students.length > 0 && (
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
          
          <div style={{ padding: "16px", background: "var(--bg)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Publishing..." : `Publish ${exam} Marks`}
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Hidden print view */}
      {!loading && students.length > 0 && (
        <ReportCardPrintView 
          students={students} 
          marks={marks} 
          exam={exam} 
          className={className} 
          subjectsArr={subjectsArr} 
          calculateGrade={calculateGrade} 
        />
      )}
    </div>
  );
}
