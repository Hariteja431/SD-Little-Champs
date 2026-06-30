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
  
  // New States for Fee Tracking
  const [totalTuition, setTotalTuition] = useState(0);
  const [tuitionPaid, setTuitionPaid] = useState(0);
  const [lastReceipt, setLastReceipt] = useState(null);
  
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
    setLastReceipt(null);
    setFormData(prev => ({...prev, amount: ""})); // reset amount
    
    // Fetch class fee info and past payments
    let fetchedTotal = 0;
    if (student.classId) {
      const classSnap = await getDocs(query(collection(db, "classes"), where("__name__", "==", student.classId)));
      if (!classSnap.empty) {
        const cInfo = classSnap.docs[0].data();
        setClassInfo(cInfo);
        
        if (student.feeType === "custom") {
          fetchedTotal = Number(student.customAnnualFee) || 0;
        } else {
          fetchedTotal = (Number(cInfo.term1Fee) || 0) + (Number(cInfo.term2Fee) || 0) + (Number(cInfo.term3Fee) || 0);
        }
        setTotalTuition(fetchedTotal);
      }
    }

    // Fetch past payments
    const paymentsSnap = await getDocs(query(collection(db, "feePayments"), where("studentId", "==", student.id)));
    let paidTotal = 0;
    paymentsSnap.forEach(doc => {
      const data = doc.data();
      if (data.feeType === "tuition") {
        paidTotal += Number(data.amount) || 0;
      }
    });
    setTuitionPaid(paidTotal);
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
        collectedByRole: "owner",
        isSettled: true,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "feePayments"), paymentData);
      
      alert(`Fee collected successfully! Receipt ID: ${receiptId}`);
      
      setLastReceipt({
        ...paymentData,
        fatherPhone: selectedStudent.fatherPhone || ""
      });
      
      // Update local state for immediate feedback if they want to pay more without refreshing
      if (formData.feeType === "tuition") {
         setTuitionPaid(prev => prev + Number(formData.amount));
      }
      
      setFormData({ feeType: "tuition", term: "1", amount: "", mode: "cash", remarks: "", date: new Date().toISOString().split("T")[0] });
    } catch (err) {
      console.error(err);
      alert("Error collecting fee.");
    }
    setSaving(false);
  };

  const sendWhatsApp = () => {
    if (!lastReceipt || !lastReceipt.fatherPhone) {
      alert("No father's phone number found for this student.");
      return;
    }

    const currentTotalPaid = tuitionPaid; // The tuitionPaid already includes this transaction due to the local update above
    const remainingBalance = totalTuition - currentTotalPaid;
    const termLabel = lastReceipt.term ? `Term ${lastReceipt.term}` : 'tuition';

    const message = `SD Little Champ's English Medium School

Dear Parent,
We have received your payment of ₹${lastReceipt.amount} towards ${termLabel} fees for ${lastReceipt.studentName} (PIN: ${lastReceipt.studentPin}).

*Fee Summary:*
Total Annual Fee: ₹${totalTuition}
Total Paid to Date: ₹${currentTotalPaid}
Remaining Balance: ₹${remainingBalance}

*Important Dates for Remaining Terms:*
- Term 2 is due in August.
- Term 3 is due in September/October.

Thank you!`;

    // Format phone number to international format, assuming India (+91) if 10 digits
    let phone = lastReceipt.fatherPhone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-print-area, .receipt-print-area * { visibility: visible; }
          .receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        .receipt-print-area { display: none; }
        @media print {
          .receipt-print-area { display: block; }
        }
      `}</style>
      <div className="no-print" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
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
              <div style={{ color: "var(--muted)" }}>PIN: <strong>{selectedStudent.pin}</strong> | Class: <strong>{selectedStudent.className}</strong> | Father's Phone: <strong>{selectedStudent.fatherPhone || "N/A"}</strong></div>
            </div>
            <button className="btn btn-ghost" onClick={() => { setSelectedStudent(null); setLastReceipt(null); }}>Change Student</button>
          </div>

          {/* Dynamic Balance Tracking UI */}
          <div style={{ display: "flex", justifyContent: "space-between", background: "var(--bg)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "24px" }}>
             <div style={{ textAlign: "center", flex: 1 }}>
               <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "bold", textTransform: "uppercase" }}>Total Annual Fee</div>
               <div style={{ fontSize: "20px", color: "var(--navy)", fontWeight: "bold" }}>₹{totalTuition}</div>
             </div>
             <div style={{ width: "1px", background: "var(--border)" }}></div>
             <div style={{ textAlign: "center", flex: 1 }}>
               <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "bold", textTransform: "uppercase" }}>Total Paid So Far</div>
               <div style={{ fontSize: "20px", color: "var(--green)", fontWeight: "bold" }}>₹{tuitionPaid}</div>
             </div>
             <div style={{ width: "1px", background: "var(--border)" }}></div>
             <div style={{ textAlign: "center", flex: 1 }}>
               <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "bold", textTransform: "uppercase" }}>Remaining Balance</div>
               <div style={{ fontSize: "20px", color: "var(--red)", fontWeight: "bold" }}>₹{Math.max(0, totalTuition - tuitionPaid)}</div>
             </div>
          </div>

          {lastReceipt && (
            <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid var(--green)", padding: "20px", borderRadius: "8px", marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "var(--green)", fontWeight: "bold", fontSize: "18px" }}>Payment Recorded! (Receipt: {lastReceipt.receiptId})</div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" onClick={sendWhatsApp} className="btn btn-primary" style={{ background: "#25D366", borderColor: "#25D366", display: "flex", alignItems: "center", gap: "8px" }}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                   Send Receipt via WhatsApp
                </button>
                <button type="button" onClick={() => window.print()} className="btn btn-ghost" style={{ border: "2px solid var(--navy)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  Print Professional Receipt
                </button>
              </div>
            </div>
          )}

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
      
      {/* Professional Receipt - Only Visible During Print */}
      {lastReceipt && (
        <div className="receipt-print-area">
          <div style={{ border: "2px solid #000", padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif", color: "#000" }}>
            <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "20px", marginBottom: "20px" }}>
              <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "2px" }}>SD Little Champ's English Medium School</h1>
              <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>Ph: +91-8886676342</p>
              <h2 style={{ display: "inline-block", background: "#000", color: "#fff", padding: "8px 24px", borderRadius: "20px", marginTop: "16px", fontSize: "18px" }}>FEE RECEIPT</h2>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "16px" }}>
              <div><strong>Receipt No:</strong> {lastReceipt.receiptId}</div>
              <div><strong>Date:</strong> {new Date(lastReceipt.date).toLocaleDateString("en-IN")}</div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}><strong>Student Name:</strong></td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{lastReceipt.studentName}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}><strong>Roll / PIN:</strong></td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{lastReceipt.studentPin}</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}><strong>Class:</strong></td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{lastReceipt.className}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}><strong>Payment Mode:</strong></td>
                  <td style={{ padding: "10px", border: "1px solid #ccc", textTransform: "capitalize" }}>{lastReceipt.mode}</td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "12px", border: "1px solid #000", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "12px", border: "1px solid #000", textAlign: "right" }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #000" }}>
                    <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>{lastReceipt.feeType} Fee</div>
                    {lastReceipt.term && <div style={{ fontSize: "14px", color: "#555" }}>Term {lastReceipt.term}</div>}
                    {lastReceipt.remarks && <div style={{ fontSize: "14px", color: "#555" }}>Note: {lastReceipt.remarks}</div>}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #000", textAlign: "right", fontSize: "18px", fontWeight: "bold" }}>
                    {lastReceipt.amount}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "80px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #000", width: "200px", paddingTop: "8px" }}>Parent / Guardian Signature</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #000", width: "200px", paddingTop: "8px" }}>Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
