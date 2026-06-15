"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function CollectFee() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(null); // Simple mock for now
  
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
    term: "1", // for tuition
    amount: "",
    mode: "cash",
    remarks: "",
    date: new Date().toISOString().split("T")[0]
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    try {
      const q = query(collection(db, "students"), where("isActive", "==", true));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.pin?.toLowerCase() === searchTerm.toLowerCase());
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchTerm("");
    
    // Fetch class fee info
    if (student.classId) {
      const classSnap = await getDocs(query(collection(db, "classes"), where("__name__", "==", student.classId)));
      if (!classSnap.empty) {
        setClassInfo(classSnap.docs[0].data());
      }
    }
  };

  const handleCollect = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const receiptId = `REC-${Date.now()}`;
      
      const paymentData = {
        receiptId,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        studentPin: selectedStudent.pin,
        classId: selectedStudent.classId,
        className: selectedStudent.className,
        feeType: formData.feeType,
        term: formData.feeType === "tuition" ? formData.term : null,
        amount: Number(formData.amount),
        mode: formData.mode,
        remarks: formData.remarks,
        date: new Date(formData.date),
        collectedByUid: user.uid,
        collectedByRole: "owner", // Because this is the owner dashboard
        isSettled: true, // Owner collections are auto-settled
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "feePayments"), paymentData);
      
      alert(`Fee collected successfully! Receipt ID: ${receiptId}`);
      setSelectedStudent(null);
      setFormData({ feeType: "tuition", term: "1", amount: "", mode: "cash", remarks: "", date: new Date().toISOString().split("T")[0] });
    } catch (err) {
      console.error(err);
      alert("Error collecting fee.");
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Collect Fee</h1>

      {!selectedStudent ? (
        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px" }}>Search Student</h2>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "16px" }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter PIN or Name..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {searchResults.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              {searchResults.map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--navy)" }}>{s.name} ({s.pin})</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>Class: {s.className} | Father: {s.fatherName}</div>
                  </div>
                  <button className="btn btn-ghost" style={{ border: "1px solid var(--navy)" }} onClick={() => handleSelectStudent(s)}>Select</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            <div>
              <h2 className="font-heading" style={{ color: "var(--navy)", fontSize: "24px", marginBottom: "4px" }}>{selectedStudent.name}</h2>
              <div style={{ color: "var(--muted)" }}>PIN: <strong>{selectedStudent.pin}</strong> | Class: <strong>{selectedStudent.className}</strong></div>
              {selectedStudent.feeType === "custom" && <div style={{ color: "var(--gold-dark)", marginTop: "4px", fontSize: "14px", fontWeight: 600 }}>Custom Concession Applied: ₹{selectedStudent.customAnnualFee}</div>}
            </div>
            <button className="btn btn-ghost" onClick={() => setSelectedStudent(null)}>Change Student</button>
          </div>

          <form onSubmit={handleCollect} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
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
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / Online</option>
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

            {/* Hint Box */}
            <div style={{ background: "var(--bg)", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>
              <strong>Expected Amounts (Based on Class Settings):</strong><br/>
              {classInfo ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: "8px", color: "var(--muted)" }}>
                  <div>Term 1: ₹{classInfo.term1Fee}</div>
                  <div>Hostel (Monthly): ₹{classInfo.hostelFeePerMonth}</div>
                  <div>Term 2: ₹{classInfo.term2Fee}</div>
                  <div>Books: ₹{classInfo.booksFee}</div>
                  <div>Term 3: ₹{classInfo.term3Fee}</div>
                </div>
              ) : (
                <span style={{ color: "var(--muted)" }}>No fee structure defined for this class.</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Amount Paid (₹)</label>
              <input type="number" className="input-field" style={{ fontSize: "24px", fontWeight: "bold", color: "var(--green)" }} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" />
            </div>

            <div className="input-group">
              <label className="input-label">Remarks (Optional)</label>
              <input type="text" className="input-field" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} placeholder="e.g. Cleared pending dues" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "16px", fontSize: "18px" }} disabled={saving}>
              {saving ? "Processing..." : "Collect Fee & Generate Receipt"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
