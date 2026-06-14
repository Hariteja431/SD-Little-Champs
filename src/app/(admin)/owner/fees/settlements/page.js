"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeacherSettlements() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all feePayments collected by teachers
    const q = query(collection(db, "feePayments"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.collectedByRole === "teacher"); // only teacher collections
      setPayments(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSettle = async (id) => {
    if (confirm("Confirm that you have received this cash from the teacher?")) {
      try {
        await updateDoc(doc(db, "feePayments", id), { isSettled: true });
      } catch (err) {
        console.error(err);
        alert("Error settling amount.");
      }
    }
  };

  const unsettledPayments = payments.filter(p => !p.isSettled);
  const settledPayments = payments.filter(p => p.isSettled).slice(0, 50); // limit history

  const totalUnsettled = unsettledPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Teacher Cash Settlements</h1>

      <div className="card" style={{ marginBottom: "32px", borderTop: "4px solid var(--gold)" }}>
        <h3 className="text-muted" style={{ fontSize: "14px", textTransform: "uppercase", fontWeight: 600 }}>Total Cash with Teachers</h3>
        <div className="font-heading" style={{ fontSize: "36px", color: "var(--gold)" }}>₹{totalUnsettled.toLocaleString()}</div>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>This amount has been collected by teachers but not yet handed over to the admin.</p>
      </div>

      <div className="card" style={{ marginBottom: "32px" }}>
        <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--red)" }}>Pending Settlements</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--muted)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Teacher Email</th>
                <th style={{ padding: "12px" }}>Student</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}>Mode</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {unsettledPayments.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", background: p.mode === "cash" ? "transparent" : "#fef2f2" }}>
                  <td style={{ padding: "12px" }}>{p.date?.toDate().toLocaleDateString('en-GB') || "N/A"}</td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{p.collectedByEmail || "Teacher"}</td>
                  <td style={{ padding: "12px" }}>{p.studentName} ({p.className})</td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "var(--navy)" }}>₹{p.amount?.toLocaleString()}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{p.mode}</td>
                  <td style={{ padding: "12px" }}>
                    <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => handleSettle(p.id)}>
                      Mark Received
                    </button>
                  </td>
                </tr>
              ))}
              {unsettledPayments.length === 0 && (
                <tr><td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No pending settlements.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--green)" }}>Recent Settled Transactions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--muted)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Teacher Email</th>
                <th style={{ padding: "12px" }}>Student</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}>Mode</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {settledPayments.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", opacity: 0.7 }}>
                  <td style={{ padding: "12px" }}>{p.date?.toDate().toLocaleDateString('en-GB') || "N/A"}</td>
                  <td style={{ padding: "12px" }}>{p.collectedByEmail || "Teacher"}</td>
                  <td style={{ padding: "12px" }}>{p.studentName}</td>
                  <td style={{ padding: "12px" }}>₹{p.amount?.toLocaleString()}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{p.mode}</td>
                  <td style={{ padding: "12px", color: "var(--green)", fontWeight: 600 }}>Settled ✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
