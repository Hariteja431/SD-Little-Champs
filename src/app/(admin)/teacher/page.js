"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const [classInfo, setClassInfo] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!userData?.assignedClass) {
        setLoading(false);
        return;
      }

      try {
        const cSnap = await getDoc(doc(db, "classes", userData.assignedClass));
        if (cSnap.exists()) setClassInfo({ id: cSnap.id, ...cSnap.data() });

        const sSnap = await getDocs(query(collection(db, "students"), where("classId", "==", userData.assignedClass), where("isActive", "==", true)));
        setStudentCount(sSnap.size);

        const dateStr = new Date().toISOString().split("T")[0];
        const aSnap = await getDocs(query(collection(db, "attendance"), where("classId", "==", userData.assignedClass), where("dateStr", "==", dateStr)));
        if (!aSnap.empty) setTodayAttendance(aSnap.docs[0].data());

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    if (userData) {
      fetchDashboard();
    }
  }, [userData]);

  if (loading) return <div>Loading dashboard...</div>;

  if (!userData?.assignedClass) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px" }}>
        <h2 className="font-heading" style={{ color: "var(--navy)", marginBottom: "16px" }}>Welcome, {userData?.name}</h2>
        <p className="text-muted">You have not been assigned a class yet. Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>My Class Dashboard</h1>
      <h2 style={{ fontSize: "20px", color: "var(--muted)", marginBottom: "32px" }}>Class: <strong style={{ color: "var(--gold-dark)" }}>{classInfo?.name}</strong></h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="card" style={{ borderTop: "4px solid var(--navy)" }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>Total Students</div>
          <div className="font-heading" style={{ fontSize: "36px", color: "var(--navy)" }}>{studentCount}</div>
          <Link href="/teacher/students" className="btn btn-ghost" style={{ marginTop: "12px", fontSize: "12px", padding: "4px 8px" }}>View List</Link>
        </div>

        <div className="card" style={{ borderTop: `4px solid ${todayAttendance ? "var(--green)" : "var(--red)"}` }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>Today's Attendance</div>
          {todayAttendance ? (
            <div>
              <div className="font-heading" style={{ fontSize: "36px", color: "var(--green)" }}>{todayAttendance.presentCount} <span style={{ fontSize: "20px", color: "var(--muted)" }}>/ {studentCount}</span></div>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>Present</div>
            </div>
          ) : (
            <div>
              <div className="font-heading" style={{ fontSize: "24px", color: "var(--red)", marginTop: "8px" }}>Not Marked</div>
              <Link href="/teacher/attendance" className="btn btn-primary" style={{ marginTop: "12px", fontSize: "12px", padding: "4px 8px" }}>Mark Now</Link>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-light))", color: "white" }}>
        <h3 className="font-heading" style={{ color: "var(--gold)", marginBottom: "16px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/teacher/attendance" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>Mark Attendance</Link>
          <Link href="/teacher/marks" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>Submit Marks</Link>
          <Link href="/teacher/fees" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>Collect Fee</Link>
        </div>
      </div>
    </div>
  );
}
