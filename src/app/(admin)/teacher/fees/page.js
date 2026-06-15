"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function CollectFeeTeacher() {
  const { user, userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [qrAmount, setQrAmount] = useState("");
  const [dynamicQrUrl, setDynamicQrUrl] = useState(null);

  const generateDynamicQr = async () => {
    if (!qrAmount || Number(qrAmount) <= 0) return alert("Enter a valid amount to generate QR");
    try {
      const QRCode = (await import("qrcode")).default;
      const upiStr = `upi://pay?pa=0797714A0249484.bqr@kotak&pn=SD%20Little%20Champs&am=${qrAmount}&cu=INR`;
      const url = await QRCode.toDataURL(upiStr, { width: 250, margin: 2 });
      setDynamicQrUrl(url);
    } catch(err) {
      console.error("QR Generation failed", err);
    }
  };

  const [formData, setFormData] = useState({
    feeType: "tuition",
    term: "1",
    amount: "",
    mode: "cash", // Teacher usually collects cash
    remarks: "",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.assignedClass) {
        // Fetch class info
        const classSnap = await getDocs(query(collection(db, "classes"), where("__name__", "==", userData.assignedClass)));
        if (!classSnap.empty) setClassInfo(classSnap.docs[0].data());

        // Fetch students
        const sSnap = await getDocs(query(collection(db, "students"), where("classId", "==", userData.assignedClass), where("isActive", "==", true)));
        setStudents(sSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.name.localeCompare(b.name)));
      }
    };
    if (userData) fetchData();
  }, [userData]);

  const handleCollect = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Select a student first");

    const s = students.find(x => x.id === selectedStudent);
    setSaving(true);
    
    try {
      const receiptId = `T-REC-${Date.now()}`;
      
      const paymentData = {
        receiptId,
        studentId: s.id,
        studentName: s.name,
        studentPin: s.pin,
        classId: s.classId,
        className: s.className,
        feeType: formData.feeType,
        term: formData.feeType === "tuition" ? formData.term : null,
        amount: Number(formData.amount),
        mode: formData.mode,
        remarks: formData.remarks,
        date: new Date(formData.date),
        collectedByUid: user.uid,
        collectedByRole: "teacher",
        collectedByEmail: user.email,
        isSettled: false, // Owner must approve
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "feePayments"), paymentData);
      
      alert(`Fee collected successfully! Receipt ID: ${receiptId}`);
      setSelectedStudent("");
      setFormData({ feeType: "tuition", term: "1", amount: "", mode: "cash", remarks: "", date: new Date().toISOString().split("T")[0] });
    } catch (err) {
      console.error(err);
      alert("Error collecting fee.");
    }
    setSaving(false);
  };

  if (!userData?.assignedClass) return <div>No class assigned.</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Collect Class Fee</h1>

      <div className="card">
        <form onSubmit={handleCollect} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div className="input-group">
            <label className="input-label">Select Student</label>
            <select className="input-field" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
              <option value="">-- Choose Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.pin})</option>)}
            </select>
          </div>

          {/* Dynamic QR Code Display */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg)", padding: "20px", borderRadius: "8px", border: "2px dashed var(--gold)" }}>
            <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "16px", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Generate Fixed-Amount UPI QR</p>
            
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", width: "100%", maxWidth: "300px" }}>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Enter Amount (₹)" 
                value={qrAmount}
                onChange={e => setQrAmount(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={generateDynamicQr} className="btn btn-primary" style={{ padding: "8px 16px" }}>Generate QR</button>
            </div>

            <div style={{ background: "white", padding: "8px", borderRadius: "8px", display: "inline-block", marginBottom: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <img src={dynamicQrUrl || "/qr-code.png"} alt="Scan to Pay QR Code" style={{ width: "180px", height: "180px", objectFit: "contain" }} />
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "15px", color: "var(--navy)", fontWeight: 600, margin: 0 }}>UPI ID: <span style={{ color: "var(--gold-dark)" }}>0797714A0249484.bqr@kotak</span></p>
            {dynamicQrUrl && <p style={{ color: "var(--green)", fontWeight: "bold", marginTop: "8px", fontSize: "14px", background: "rgba(34, 197, 94, 0.1)", padding: "4px 12px", borderRadius: "20px" }}>✓ Scanning this will pre-fill ₹{qrAmount}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="input-group">
              <label className="input-label">Payment Mode</label>
              <select className="input-field" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                <option value="cash">Cash (To Handover)</option>
                <option value="upi">UPI (School QR)</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Fee Type</label>
              <select className="input-field" value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}>
                <option value="tuition">Tuition Fee</option>
                <option value="hostel">Hostel Fee</option>
                <option value="books">Books & Uniform</option>
                <option value="other">Other</option>
              </select>
            </div>
            {formData.feeType === "tuition" && (
              <div className="input-group">
                <label className="input-label">Term</label>
                <select className="input-field" value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}>
                  <option value="1">Term 1</option>
                  <option value="2">Term 2</option>
                  <option value="3">Term 3</option>
                  <option value="annual">Full Annual</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ background: "var(--bg)", padding: "12px", borderRadius: "8px", fontSize: "14px", color: "var(--muted)" }}>
            * Note: Cash collected must be handed over to the admin. It will remain in "Unsettled" status until approved by the owner.
          </div>

          <div className="input-group">
            <label className="input-label">Amount Paid (₹)</label>
            <input type="number" className="input-field" style={{ fontSize: "24px", fontWeight: "bold", color: "var(--green)" }} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "16px", fontSize: "18px" }} disabled={saving}>
            {saving ? "Processing..." : "Collect Fee"}
          </button>
        </form>
      </div>
    </div>
  );
}
