"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    feesCollected: 0,
    pendingFees: 0,
    teacherCash: 0,
    totalExpenses: 0,
    grandTotal: 0
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Students Count & Class Distribution
      const studentsSnapshot = await getDocs(query(collection(db, "students"), where("isActive", "==", true)));
      const students = studentsSnapshot.docs.map(d => d.data());
      const totalStudents = students.length;

      const classCounts = {};
      students.forEach(s => {
        classCounts[s.className] = (classCounts[s.className] || 0) + 1;
      });

      // 2. Fees
      const feesSnapshot = await getDocs(collection(db, "feePayments"));
      const fees = feesSnapshot.docs.map(d => d.data());
      
      let feesCollected = 0;
      let teacherCash = 0;
      let tuitionTotal = 0;
      let hostelTotal = 0;
      let booksTotal = 0;

      fees.forEach(f => {
        feesCollected += Number(f.amount || 0);
        if (f.collectedByRole === "teacher" && f.isSettled === false) {
          teacherCash += Number(f.amount || 0);
        }
        if (f.feeType === "tuition") tuitionTotal += Number(f.amount || 0);
        if (f.feeType === "hostel") hostelTotal += Number(f.amount || 0);
        if (f.feeType === "books") booksTotal += Number(f.amount || 0);
      });

      // Sort for recent transactions
      const sortedFees = feesSnapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.date?.toMillis() - a.date?.toMillis())
        .slice(0, 10);

      // 3. Expenses
      const expensesSnapshot = await getDocs(collection(db, "expenses"));
      let totalExpenses = 0;
      expensesSnapshot.forEach(d => {
        totalExpenses += Number(d.data().amount || 0);
      });

      // 4. Classes for calculating expected fees (simplified for MVP: expected = active classes * students approx)
      // Pending Fees is very complex to calculate accurately without knowing every student's individual pending amount vs fee structure
      // For MVP dashboard, we will just use a placeholder or simplified logic if needed. Let's set it to 0 for now.
      const pendingFees = 0; // Requires deep calculation per student

      setStats({
        totalStudents,
        feesCollected,
        pendingFees,
        teacherCash,
        totalExpenses,
        grandTotal: feesCollected - totalExpenses
      });

      setRecentTransactions(sortedFees);

      setChartData({
        bar: {
          labels: Object.keys(classCounts),
          datasets: [{
            label: "Students per Class",
            data: Object.values(classCounts),
            backgroundColor: "#0d1b4b"
          }]
        },
        doughnut: {
          labels: ["Tuition", "Hostel", "Books"],
          datasets: [{
            data: [tuitionTotal, hostelTotal, booksTotal],
            backgroundColor: ["#1d4ed8", "#16a34a", "#f59e0b"]
          }]
        }
      });

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
    setLoading(false);
  };

  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet([{
      "Total Students": stats.totalStudents,
      "Fees Collected": stats.feesCollected,
      "Unsettled Teacher Cash": stats.teacherCash,
      "Total Expenses": stats.totalExpenses,
      "Net Balance": stats.grandTotal
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard Summary");
    XLSX.writeFile(wb, "Dashboard_Summary.xlsx");
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)" }}>Overview</h1>
        <button className="btn btn-primary" onClick={exportData}>Export Summary (Excel)</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <StatCard title="Total Students" value={stats.totalStudents} color="var(--navy)" />
        <StatCard title="Fees Collected" value={`₹${stats.feesCollected.toLocaleString()}`} color="var(--green)" />
        {/* <StatCard title="Pending Fees" value={`₹${stats.pendingFees.toLocaleString()}`} color="var(--red)" /> */}
        <StatCard title="Teacher Cash" value={`₹${stats.teacherCash.toLocaleString()}`} color="var(--gold)" />
        <StatCard title="Total Expenses" value={`₹${stats.totalExpenses.toLocaleString()}`} color="var(--red)" />
        <StatCard title="Net Balance" value={`₹${stats.grandTotal.toLocaleString()}`} color="var(--sky)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div className="card">
          <h3 className="font-heading" style={{ marginBottom: "16px" }}>Students per Class</h3>
          <div style={{ height: "300px", position: "relative" }}>
            {chartData?.bar && <Bar data={chartData.bar} options={{ maintainAspectRatio: false }} />}
          </div>
        </div>
        <div className="card">
          <h3 className="font-heading" style={{ marginBottom: "16px" }}>Fee Collection Breakdown</h3>
          <div style={{ height: "300px", position: "relative" }}>
            {chartData?.doughnut && <Doughnut data={chartData.doughnut} options={{ maintainAspectRatio: false }} />}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-heading" style={{ marginBottom: "16px" }}>Recent Transactions</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", color: "var(--muted)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Student</th>
                <th style={{ padding: "12px" }}>Class</th>
                <th style={{ padding: "12px" }}>Type</th>
                <th style={{ padding: "12px" }}>Mode</th>
                <th style={{ padding: "12px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px" }}>{t.date?.toDate().toLocaleDateString('en-GB') || "N/A"}</td>
                  <td style={{ padding: "12px" }}>{t.studentName} ({t.studentPin})</td>
                  <td style={{ padding: "12px" }}>{t.className}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{t.feeType}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{t.mode}</td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "var(--green)" }}>₹{t.amount?.toLocaleString()}</td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>{title}</div>
      <div className="font-heading" style={{ fontSize: "28px", color }}>{value}</div>
    </div>
  );
}
