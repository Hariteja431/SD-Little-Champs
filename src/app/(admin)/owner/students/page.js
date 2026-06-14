"use client";
import { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");

  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch active students
      const stuSnap = await getDocs(query(collection(db, "students"), where("isActive", "==", true)));
      const stuData = stuSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(stuData);
      setFilteredStudents(stuData);

      // Fetch classes for filter dropdown
      const clsSnap = await getDocs(collection(db, "classes"));
      setClasses(clsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = students;
    if (search) {
      result = result.filter(s => 
        s.name?.toLowerCase().includes(search.toLowerCase()) || 
        s.pin?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (classFilter !== "All") {
      result = result.filter(s => s.classId === classFilter);
    }
    if (genderFilter !== "All") {
      result = result.filter(s => s.gender === genderFilter);
    }
    setFilteredStudents(result);
  }, [search, classFilter, genderFilter, students]);

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to deactivate ${name}?`)) {
      await updateDoc(doc(db, "students", id), { isActive: false });
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToUpdate } = editingStudent;
      await updateDoc(doc(db, "students", id), dataToUpdate);
      
      setStudents(prev => prev.map(s => s.id === id ? editingStudent : s));
      setEditingStudent(null);
      alert("Student updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update student.");
    }
  };

  const handleExport = () => {
    const wsData = filteredStudents.map(s => ({
      PIN: s.pin,
      Name: s.name,
      Class: s.className,
      Gender: s.gender,
      DOB: s.dob,
      Father: s.fatherName,
      Phone: s.fatherPhone,
      Aadhaar: s.aadhaar
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Students_List.xlsx");
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>All Students</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-primary no-print" onClick={handleExport}>Export Excel</button>
          <button className="btn btn-ghost no-print" style={{ border: "1px solid var(--border)" }} onClick={() => window.print()}>Print List</button>
        </div>
      </div>

      <div className="card no-print" style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap", padding: "16px" }}>
        <input 
          type="text" 
          placeholder="Search by Name or PIN..." 
          className="input-field" 
          style={{ flex: 1, minWidth: "200px" }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input-field" style={{ width: "auto" }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="All">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-field" style={{ width: "auto" }} value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg)", color: "var(--navy)", borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "16px" }}>PIN</th>
              <th style={{ padding: "16px" }}>Name</th>
              <th style={{ padding: "16px" }}>Class</th>
              <th style={{ padding: "16px" }}>Father's Name</th>
              <th style={{ padding: "16px" }}>Phone</th>
              <th style={{ padding: "16px" }} className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              editingStudent?.id === student.id ? (
                <tr key={student.id} style={{ background: "rgba(245, 158, 11, 0.05)", borderBottom: "2px solid var(--border)" }}>
                  <td colSpan="6" style={{ padding: "16px" }}>
                    <form onSubmit={handleSaveEdit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="input-group">
                        <label className="input-label">PIN (Uneditable)</label>
                        <input className="input-field" value={editingStudent.pin} disabled style={{ background: "var(--bg)" }} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Name</label>
                        <input className="input-field" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Class</label>
                        <select className="input-field" value={editingStudent.classId} onChange={e => {
                          const cls = classes.find(c => c.id === e.target.value);
                          setEditingStudent({...editingStudent, classId: cls.id, className: cls.name});
                        }} required>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Father's Name</label>
                        <input className="input-field" value={editingStudent.fatherName} onChange={e => setEditingStudent({...editingStudent, fatherName: e.target.value})} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Father's Phone</label>
                        <input className="input-field" value={editingStudent.fatherPhone} onChange={e => setEditingStudent({...editingStudent, fatherPhone: e.target.value})} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Gender</label>
                        <select className="input-field" value={editingStudent.gender} onChange={e => setEditingStudent({...editingStudent, gender: e.target.value})}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                        <button type="button" className="btn btn-ghost" onClick={() => setEditingStudent(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={student.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "bold", color: "var(--navy)" }}>{student.pin}</td>
                  <td style={{ padding: "12px 16px" }}>{student.name}</td>
                  <td style={{ padding: "12px 16px" }}>{student.className}</td>
                  <td style={{ padding: "12px 16px" }}>{student.fatherName}</td>
                  <td style={{ padding: "12px 16px" }}>{student.fatherPhone}</td>
                  <td style={{ padding: "12px 16px" }} className="no-print">
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => setEditingStudent(student)}>Edit</button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                        onClick={() => handleDelete(student.id, student.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No students found matching the criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
