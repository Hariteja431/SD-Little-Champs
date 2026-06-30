"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterStudent() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successPin, setSuccessPin] = useState(null);

  const [formData, setFormData] = useState({
    name: "", dob: "", gender: "Male", bloodGroup: "O+", classId: "", className: "",
    admissionDate: new Date().toISOString().split("T")[0], aadhaar: "", previousSchool: "", address: "",
    fatherName: "", fatherOccupation: "Business", fatherPhone: "", fatherAadhaar: "",
    motherName: "", motherPhone: "", motherAadhaar: "", emergencyContact: "",
    feeType: "class", customAnnualFee: 0, hostelStudent: false,
    academicYear: "2026-27", pin: ""
  });

  useEffect(() => {
    const fetchClasses = async () => {
      const snap = await getDocs(query(collection(db, "classes"), where("isActive", "==", true)));
      const clsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setClasses(clsData);
      if (clsData.length > 0) {
        setFormData(prev => ({ ...prev, classId: clsData[0].id, className: clsData[0].name }));
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "classId") {
      const cls = classes.find(c => c.id === value);
      setFormData(prev => ({ ...prev, classId: value, className: cls?.name || "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const generatePin = async () => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"), limit(1));
    const snap = await getDocs(q);
    let newNum = 1;
    if (!snap.empty) {
      const lastPin = snap.docs[0].data().pin; // e.g. "SD0042"
      if (lastPin && lastPin.startsWith("SD")) {
        const num = parseInt(lastPin.replace("SD", ""), 10);
        if (!isNaN(num)) newNum = num + 1;
      }
    }
    return `SD${String(newNum).padStart(4, '0')}`;
  };

  useEffect(() => {
    const initPin = async () => {
      const p = await generatePin();
      setFormData(prev => ({ ...prev, pin: p }));
    };
    initPin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pin.trim()) {
      alert("Please enter a Roll Number / PIN.");
      return;
    }
    setSaving(true);
    try {
      // Check for duplicate PIN
      const pinQuery = query(collection(db, "students"), where("pin", "==", formData.pin.trim()));
      const pinSnap = await getDocs(pinQuery);
      if (!pinSnap.empty) {
        alert("This Roll Number / PIN is already assigned to another student. Please enter a different one.");
        setSaving(false);
        return;
      }

      const docRef = await addDoc(collection(db, "students"), {
        ...formData,
        pin: formData.pin.trim(),
        isActive: true,
        createdAt: serverTimestamp()
      });
      setSuccessPin(formData.pin.trim());
    } catch (err) {
      console.error(err);
      alert("Failed to register student.");
    }
    setSaving(false);
  };

  if (successPin) {
    return (
      <div className="card" style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 className="font-heading" style={{ color: "var(--navy)", marginBottom: "8px" }}>Registration Successful!</h2>
        <p className="text-muted" style={{ marginBottom: "24px" }}>Student has been registered with PIN:</p>
        <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--gold)", letterSpacing: "2px", marginBottom: "32px" }}>
          {successPin}
        </div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={() => window.print()}>Print Slip</button>
          <button className="btn btn-primary" onClick={() => { setSuccessPin(null); setFormData({...formData, name: "", aadhaar: ""}); }}>Register Another</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="font-heading" style={{ fontSize: "28px", color: "var(--navy)", marginBottom: "24px" }}>Register Student</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Student Details */}
        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Student Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label">Roll Number / PIN</label>
              <input type="text" className="input-field" name="pin" value={formData.pin} onChange={handleChange} required style={{ fontWeight: "bold", color: "var(--navy)" }} />
            </div>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Date of Birth</label>
              <input type="date" className="input-field" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Gender</label>
              <select className="input-field" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Blood Group</label>
              <select className="input-field" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Class</label>
              <select className="input-field" name="classId" value={formData.classId} onChange={handleChange} required>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Admission Date</label>
              <input type="date" className="input-field" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Aadhaar Number</label>
              <input type="text" className="input-field" name="aadhaar" value={formData.aadhaar} onChange={handleChange} maxLength={12} pattern="\d{12}" placeholder="12 digit Aadhaar" />
            </div>
            <div className="input-group">
              <label className="input-label">Previous School</label>
              <input type="text" className="input-field" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
            </div>
          </div>
          <div className="input-group" style={{ marginTop: "16px" }}>
            <label className="input-label">Address</label>
            <textarea className="input-field" rows="2" name="address" value={formData.address} onChange={handleChange} required />
          </div>
        </div>

        {/* Parent Details */}
        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Parent / Guardian Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label">Father's Name</label>
              <input type="text" className="input-field" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Father's Phone</label>
              <input type="tel" className="input-field" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} pattern="\d{10}" required />
            </div>
            <div className="input-group">
              <label className="input-label">Father's Occupation</label>
              <select className="input-field" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange}>
                {["Farmer", "Business", "Employee", "Teacher", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Father's Aadhaar</label>
              <input type="text" className="input-field" name="fatherAadhaar" value={formData.fatherAadhaar} onChange={handleChange} maxLength={12} pattern="\d{12}" />
            </div>
            <div className="input-group">
              <label className="input-label">Mother's Name</label>
              <input type="text" className="input-field" name="motherName" value={formData.motherName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Mother's Phone</label>
              <input type="tel" className="input-field" name="motherPhone" value={formData.motherPhone} onChange={handleChange} pattern="\d{10}" />
            </div>
            <div className="input-group">
              <label className="input-label">Mother's Aadhaar</label>
              <input type="text" className="input-field" name="motherAadhaar" value={formData.motherAadhaar} onChange={handleChange} maxLength={12} pattern="\d{12}" />
            </div>
            <div className="input-group">
              <label className="input-label">Emergency Contact</label>
              <input type="tel" className="input-field" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} pattern="\d{10}" required />
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="card">
          <h2 className="font-heading" style={{ marginBottom: "16px", color: "var(--navy)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Fee Settings</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label">Fee Type</label>
              <select className="input-field" name="feeType" value={formData.feeType} onChange={handleChange}>
                <option value="class">Use Class Default Fee</option>
                <option value="custom">Custom Concession Fee</option>
              </select>
            </div>
            {formData.feeType === "custom" && (
              <div className="input-group">
                <label className="input-label">Custom Annual Tuition (₹)</label>
                <input type="number" className="input-field" name="customAnnualFee" value={formData.customAnnualFee} onChange={handleChange} required />
              </div>
            )}
            <div className="input-group" style={{ justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" id="hostelStudent" name="hostelStudent" checked={formData.hostelStudent} onChange={handleChange} />
                <label htmlFor="hostelStudent" style={{ fontSize: "14px", fontWeight: 600 }}>Hostel Student</label>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Academic Year</label>
              <input type="text" className="input-field" name="academicYear" value={formData.academicYear} readOnly style={{ background: "var(--bg)" }} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "16px", fontSize: "18px" }} disabled={saving}>
          {saving ? "Registering..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
