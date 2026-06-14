import React from 'react';

export default function ReportCardPrintView({ students, marks, exam, className, subjectsArr, calculateGrade }) {
  if (!students || students.length === 0) return null;

  return (
    <div className="print-only">
      {students.map((student, i) => {
        const stuMarks = marks[student.id] || {};
        let total = 0;
        subjectsArr.forEach(sub => total += (stuMarks[sub] || 0));
        const maxTotal = subjectsArr.length * 100;
        const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : 0;
        
        return (
          <div key={student.id} style={{ pageBreakAfter: 'always', padding: '40px', fontFamily: 'sans-serif' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #2c3e50', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', textTransform: 'uppercase' }}>SD Little Champ's E.M School</h1>
              <p style={{ margin: '5px 0', color: '#7f8c8d', fontSize: '18px', fontWeight: 'bold' }}>Progress Report - {exam}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '16px' }}>
              <div>
                <p style={{ marginBottom: '8px' }}><strong>Student Name:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{student.name}</span></p>
                <p><strong>PIN / Roll No:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{student.pin}</span></p>
              </div>
              <div>
                <p style={{ marginBottom: '8px' }}><strong>Class:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{className}</span></p>
                <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{new Date().toLocaleDateString()}</span></p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', border: '2px solid #000' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #000' }}>
                  <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'left' }}>Subject</th>
                  <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>Maximum Marks</th>
                  <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {subjectsArr.map(sub => (
                  <tr key={sub}>
                    <td style={{ border: '1px solid #000', padding: '12px', fontWeight: 'bold' }}>{sub}</td>
                    <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>100</td>
                    <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>{stuMarks[sub] || 0}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', borderTop: '2px solid #000' }}>
                  <td style={{ border: '1px solid #000', padding: '12px' }}>Total</td>
                  <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>{maxTotal}</td>
                  <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'center' }}>{total}</td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', fontSize: '16px' }}>
              <p><strong>Percentage:</strong> {percentage}%</p>
              <p><strong>Grade Obtained:</strong> <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginLeft: '8px' }}>{calculateGrade ? calculateGrade(percentage) : '-'}</span></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '100px' }}>
              <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>Class Teacher Signature</div>
              <div style={{ borderTop: '1px solid #000', width: '250px', textAlign: 'center', paddingTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>Principal Signature</div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#95a5a6' }}>
              * This is a computer generated progress report.
            </div>
          </div>
        );
      })}
    </div>
  );
}
