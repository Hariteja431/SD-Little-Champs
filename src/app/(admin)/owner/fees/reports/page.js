"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";

export default function FeeReports() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(query(collection(db, "feePayments"), orderBy("date", "desc")));
      const pData = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPayments(pData);
      setFilteredPayments(pData);

      const cSnap = await getDocs(collection(db, "classes"));
      setClasses(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = payments;

    if (classFilter !== "all") {
      result = result.filter(p => p.classId === classFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      result = result.filter(p => {
        const pDate = p.date?.toDate() || new Date(0);
        if (dateFilter === "today") return pDate >= todayStart;
        if (dateFilter === "month") return pDate >= thisMonthStart;
        return true;
      });
    }

    setFilteredPayments(result);
  }, [dateFilter, classFilter, payments]);

  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const upiAmount = filteredPayments.filter(p => p.mode === "upi").reduce((sum, p) => sum + (p.amount || 0), 0);
  const cashAmount = filteredPayments.filter(p => p.mode === "cash").reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleExport = () => {
    const wsData = filteredPayments.map(p => ({
      Receipt: p.receiptId,
      Date: p.date?.toDate().toLocaleDateString('en-GB') || "N/A",
      Student: p.studentName,
      PIN: p.studentPin,
      Class: p.className,
      "Fee Type": p.feeType,
      Term: p.term || "N/A",
      Mode: p.mode,
      Amount: p.amount,
      CollectedBy: p.collectedByRole,
      Settled: p.isSettled ? "Yes" : "No"
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fee_Report");
    XLSX.writeFile(wb, "Fee_Report.xlsx");
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Fee Reports</h1>
        <button className="btn btn-primary no-print" onClick={handleExport}>Export to Excel</button>
      </div>

      <div className="card no-print" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">Date Filter</label>
          <select className="input-field" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label className="input-label">Class Filter</label>
          <select className="input-field" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="card" style={{ borderTop: "4px solid var(--navy)" }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>Total Collected</div>
          <div className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--green)" }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>Cash Collected</div>
          <div className="font-heading" style={{ fontSize: "28px", color: "var(--green)" }}>₹{cashAmount.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--sky)" }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>UPI Collected</div>
          <div className="font-heading" style={{ fontSize: "28px", color: "var(--sky)" }}>₹{upiAmount.toLocaleString()}</div>
        </div>
        <div className="card" style={{ borderTop: "4px solid var(--gold)" }}>
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>Transactions</div>
          <div className="font-heading" style={{ fontSize: "28px", color: "var(--gold)" }}>{filteredPayments.length}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg)", color: "var(--navy)", borderBottom: "2px solid var(--border)" }}>
              <th style={{ padding: "16px" }}>Receipt</th>
              <th style={{ padding: "16px" }}>Date</th>
              <th style={{ padding: "16px" }}>Student</th>
              <th style={{ padding: "16px" }}>Class</th>
              <th style={{ padding: "16px" }}>Type</th>
              <th style={{ padding: "16px" }}>Mode</th>
              <th style={{ padding: "16px" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 16px", fontSize: "12px" }}>{p.receiptId}</td>
                <td style={{ padding: "12px 16px" }}>{p.date?.toDate().toLocaleDateString('en-GB') || "N/A"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600 }}>{p.studentName}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>PIN: {p.studentPin}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>{p.className}</td>
                <td style={{ padding: "12px 16px", textTransform: "capitalize" }}>{p.feeType} {p.term ? `(T${p.term})` : ''}</td>
                <td style={{ padding: "12px 16px", textTransform: "uppercase", fontWeight: 600, color: p.mode === "upi" ? "var(--sky)" : "var(--green)" }}>{p.mode}</td>
                <td style={{ padding: "12px 16px", fontWeight: "bold", color: "var(--navy)" }}>₹{p.amount?.toLocaleString()}</td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
