import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { reportStore } from '@/lib/store';
import { Report } from '@/types';

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) setReport(reportStore.getById(id) || null);
  }, [id]);

  if (!report) return <div className="text-center py-8 text-muted-foreground">Report not found</div>;

  const flagStyle: Record<string, string> = {
    high: 'text-high font-semibold',
    low: 'text-low font-semibold',
    critical: 'text-critical font-bold',
    normal: 'text-normal',
  };

  const statusColor: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning',
    verified: 'bg-info/10 text-info',
    printed: 'bg-success/10 text-success',
    delivered: 'bg-accent/10 text-accent',
  };

  const groupedItems = report.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof report.items>);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/reports"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{report.reportNumber}</h1>
          <p className="text-sm text-muted-foreground">{report.patientName}</p>
        </div>
        <Badge className={statusColor[report.status]}>{report.status}</Badge>
        <Button asChild><Link to={`/reports/${report.id}/print`}><Printer className="w-4 h-4 mr-1" />Print</Link></Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Patient</p>
          <p className="font-medium text-foreground">{report.patientName}</p>
          <p className="text-sm text-muted-foreground">{report.patientAge} / {report.patientGender}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Doctor</p>
          <p className="font-medium text-foreground">{report.doctorName || 'N/A'}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Dates</p>
          <p className="text-sm text-foreground">Sample: {report.sampleCollectionDate}</p>
          <p className="text-sm text-foreground">Report: {report.reportDate}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Test</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Result</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Unit</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Reference Range</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Flag</th>
                </tr></thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="p-3 font-medium text-foreground">{item.testName}</td>
                      <td className={`p-3 ${flagStyle[item.flag] || ''}`}>{item.result || '-'}</td>
                      <td className="p-3 text-muted-foreground">{item.unit}</td>
                      <td className="p-3 text-muted-foreground">{item.referenceRange}</td>
                      <td className="p-3">
                        {item.flag && item.flag !== 'normal' && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.flag === 'high' ? 'bg-high text-high' : item.flag === 'low' ? 'bg-low text-low' : 'bg-critical text-critical'}`}>
                            {item.flag === 'high' ? 'H' : item.flag === 'low' ? 'L' : 'C'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </CardContent>
      </Card>

      {report.remarks && (
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Remarks</p>
          <p className="text-sm text-foreground">{report.remarks}</p>
        </CardContent></Card>
      )}
    </div>
  );
}
