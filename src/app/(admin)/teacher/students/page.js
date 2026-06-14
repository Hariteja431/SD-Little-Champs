"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function MyStudents() {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (userData?.assignedClass) {
        const snap = await getDocs(query(collection(db, "students"), where("classId", "==", userData.assignedClass), where("isActive", "==", true)));
        setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    };
    if (userData) fetchStudents();
  }, [userData]);

  if (loading) return <div>Loading students...</div>;

  if (!userData?.assignedClass) {
    return <div>No class assigned.</div>;
  }

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>My Students</h1>
      
      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg)", color: "var(--navy)", borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "16px" }}>PIN</th>
              <th style={{ padding: "16px" }}>Name</th>
              <th style={{ padding: "16px" }}>Gender</th>
              <th style={{ padding: "16px" }}>Father's Name</th>
              <th style={{ padding: "16px" }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px", fontWeight: "bold", color: "var(--navy)" }}>{s.pin}</td>
                <td style={{ padding: "12px 16px" }}>{s.name}</td>
                <td style={{ padding: "12px 16px" }}>{s.gender}</td>
                <td style={{ padding: "12px 16px" }}>{s.fatherName}</td>
                <td style={{ padding: "12px 16px" }}>{s.fatherPhone}</td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No students found in this class.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
