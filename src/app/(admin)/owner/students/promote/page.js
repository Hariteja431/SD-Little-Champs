"use client";
import { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PromoteStudents() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const snap = await getDocs(collection(db, "classes"));
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (fromClass) {
      const fetchStudents = async () => {
        const snap = await getDocs(query(collection(db, "students"), where("classId", "==", fromClass), where("isActive", "==", true)));
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setSelectedStudents([]); // reset selection
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [fromClass]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handlePromote = async () => {
    if (!toClass) return alert("Select target class.");
    if (selectedStudents.length === 0) return alert("Select students to promote.");
    if (!confirm(`Promote ${selectedStudents.length} students?`)) return;

    setProcessing(true);
    try {
      const targetCls = classes.find(c => c.id === toClass);
      const promises = selectedStudents.map(id => {
        return updateDoc(doc(db, "students", id), {
          classId: targetCls.id,
          className: targetCls.name
        });
      });
      await Promise.all(promises);
      alert("Promotion successful!");
      setFromClass("");
      setToClass("");
      setStudents([]);
    } catch (err) {
      console.error(err);
      alert("Error promoting students.");
    }
    setProcessing(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) return alert("Select students to delete.");
    if (!confirm(`Permanently deactivate ${selectedStudents.length} students?`)) return;

    setProcessing(true);
    try {
      const promises = selectedStudents.map(id => {
        return updateDoc(doc(db, "students", id), { isActive: false });
      });
      await Promise.all(promises);
      alert("Students deactivated.");
      setFromClass("");
      setStudents([]);
    } catch (err) {
      console.error(err);
      alert("Error deleting students.");
    }
    setProcessing(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Promote / Delete Students</h1>

      <div className="card" style={{ marginBottom: "24px", display: "flex", gap: "24px" }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">Select Source Class</label>
          <select className="input-field" value={fromClass} onChange={e => setFromClass(e.target.value)}>
            <option value="">-- Choose Class --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">Select Target Class (For Promotion)</label>
          <select className="input-field" value={toClass} onChange={e => setToClass(e.target.value)}>
            <option value="">-- Choose Target --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {fromClass && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px", background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" id="selectAll" checked={students.length > 0 && selectedStudents.length === students.length} onChange={handleSelectAll} />
              <label htmlFor="selectAll" style={{ fontWeight: 600 }}>Select All ({selectedStudents.length} selected)</label>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-danger" disabled={processing || selectedStudents.length === 0} onClick={handleDeleteSelected}>Deactivate Selected</button>
              <button className="btn btn-primary" disabled={processing || selectedStudents.length === 0} onClick={handlePromote}>Promote Selected</button>
            </div>
          </div>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {students.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)", gap: "16px" }}>
                <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => handleSelect(s.id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--navy)" }}>{s.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>PIN: {s.pin} | Father: {s.fatherName}</div>
                </div>
              </div>
            ))}
            {students.length === 0 && <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No students found in this class.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
