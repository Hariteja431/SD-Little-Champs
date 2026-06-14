"use client";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Salary",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    receiptNo: ""
  });

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "expenses"), {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date),
        createdAt: serverTimestamp()
      });
      setFormData({ title: "", category: "Salary", amount: "", date: new Date().toISOString().split("T")[0], receiptNo: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this expense record?")) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  const total = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
      
      <div className="card" style={{ flex: "1", minWidth: "300px", position: "sticky", top: "24px" }}>
        <h2 className="font-heading" style={{ marginBottom: "20px" }}>Add Expense</h2>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="input-group">
            <label className="input-label">Date</label>
            <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Salary">Salary</option>
              <option value="Maintenance">Maintenance / Repairs</option>
              <option value="Electricity">Electricity & Utilities</option>
              <option value="Events">Events & Functions</option>
              <option value="Marketing">Marketing / Ads</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Description / Title</label>
            <input type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Amount (₹)</label>
            <input type="number" className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Bill / Receipt No. (Optional)</label>
            <input type="text" className="input-field" value={formData.receiptNo} onChange={e => setFormData({...formData, receiptNo: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div style={{ flex: "2", minWidth: "400px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="font-heading">Expense History</h2>
          <div style={{ background: "var(--white)", padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontWeight: "bold", color: "var(--red)" }}>
            Total: ₹{total.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Category</th>
                <th style={{ padding: "12px" }}>Description</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{exp.date?.toDate().toLocaleDateString('en-GB') || "N/A"}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: "12px", background: "var(--bg)", padding: "4px 8px", borderRadius: "12px", fontWeight: 600 }}>{exp.category}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: 600 }}>{exp.title}</div>
                    {exp.receiptNo && <div style={{ fontSize: "12px", color: "var(--muted)" }}>Bill: {exp.receiptNo}</div>}
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "var(--red)" }}>₹{exp.amount?.toLocaleString()}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No expenses recorded.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
