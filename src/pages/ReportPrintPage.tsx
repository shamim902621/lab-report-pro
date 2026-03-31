import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reportStore, getSettings } from '@/lib/store';
import { Report, LabSettings } from '@/types';

export default function ReportPrintPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [settings, setSettings] = useState<LabSettings>(getSettings());

  useEffect(() => {
    if (id) {
      setReport(reportStore.getById(id) || null);
      setSettings(getSettings());
    }
  }, [id]);

  useEffect(() => {
    if (report) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [report]);

  if (!report) return <div style={{ padding: 40, textAlign: 'center' }}>Report not found</div>;

  const groupedItems = report.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof report.items>);

  return (
    <div style={{ maxWidth: '210mm', margin: '0 auto', padding: '8mm 12mm', fontFamily: 'Inter, Arial, sans-serif', fontSize: '10pt', color: '#1a1a1a', background: 'white', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a6cb5', paddingBottom: 12, marginBottom: 12 }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 700, color: '#1a6cb5', margin: 0 }}>{settings.labName}</h1>
        <p style={{ fontSize: '9pt', color: '#555', margin: '4px 0 0' }}>{settings.address}</p>
        <p style={{ fontSize: '8pt', color: '#555', margin: '2px 0 0' }}>
          Ph: {settings.phone} | Email: {settings.email}
          {settings.registrationNumber && ` | Reg: ${settings.registrationNumber}`}
          {settings.nablNumber && ` | NABL: ${settings.nablNumber}`}
        </p>
      </div>

      {/* Patient Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '9pt', marginBottom: 16, border: '1px solid #ddd', padding: 10, borderRadius: 4 }}>
        <div><strong>Patient:</strong> {report.patientName}</div>
        <div><strong>Report No:</strong> {report.reportNumber}</div>
        <div><strong>Age / Gender:</strong> {report.patientAge} / {report.patientGender}</div>
        <div><strong>Sample Date:</strong> {report.sampleCollectionDate}</div>
        <div><strong>Ref. Doctor:</strong> {report.doctorName || 'Self'}</div>
        <div><strong>Report Date:</strong> {report.reportDate}</div>
      </div>

      {/* Test Results */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
        <thead>
          <tr style={{ background: '#f0f5fa', borderBottom: '2px solid #1a6cb5' }}>
            <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Test Name</th>
            <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Result</th>
            <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Unit</th>
            <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Biological Ref. Range</th>
            <th style={{ textAlign: 'center', padding: '6px 8px', fontWeight: 600, width: 40 }}>Flag</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedItems).map(([category, items]) => (
            <React.Fragment key={category}>
              <tr>
                <td colSpan={5} style={{ padding: '6px 8px', fontWeight: 700, fontSize: '9pt', background: '#f8f9fa', borderBottom: '1px solid #ddd', color: '#1a6cb5' }}>
                  {category}
                </td>
              </tr>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '5px 8px' }}>{item.testName}</td>
                  <td style={{
                    padding: '5px 8px',
                    fontWeight: item.flag && item.flag !== 'normal' ? 700 : 400,
                    color: item.flag === 'high' ? '#dc2626' : item.flag === 'low' ? '#2563eb' : item.flag === 'critical' ? '#991b1b' : '#1a1a1a'
                  }}>
                    {item.result || '-'}
                  </td>
                  <td style={{ padding: '5px 8px', color: '#666' }}>{item.unit}</td>
                  <td style={{ padding: '5px 8px', color: '#666' }}>{item.referenceRange}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: item.flag === 'high' ? '#dc2626' : item.flag === 'low' ? '#2563eb' : item.flag === 'critical' ? '#991b1b' : 'transparent' }}>
                    {item.flag === 'high' ? 'H' : item.flag === 'low' ? 'L' : item.flag === 'critical' ? 'C' : ''}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Remarks */}
      {report.remarks && (
        <div style={{ marginTop: 16, padding: '8px 10px', background: '#f8f9fa', borderRadius: 4, fontSize: '9pt' }}>
          <strong>Remarks:</strong> {report.remarks}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ddd', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '8pt' }}>
        <div>
          <p style={{ color: '#888', fontStyle: 'italic' }}>{settings.footerNote}</p>
          <p style={{ marginTop: 4, color: '#aaa' }}>H = High | L = Low | C = Critical</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: 4, marginTop: 30 }}>
            <p style={{ fontWeight: 600 }}>{settings.pathologistName}</p>
            <p style={{ color: '#666' }}>{settings.qualification}</p>
            <p style={{ color: '#666' }}>Pathologist</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, fontSize: '8pt', color: '#aaa' }}>
        --- End of Report ---
      </div>
    </div>
  );
}
