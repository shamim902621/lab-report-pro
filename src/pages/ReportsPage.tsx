import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Printer, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { reportStore, patientStore, doctorStore, testStore, profileStore, generateId, generateSequentialId } from '@/lib/store';
import { Report, ReportItem, Test } from '@/types';

function getFlag(value: string, refRange: string, test: Test): ReportItem['flag'] {
  if (!value || !refRange || test.resultType !== 'numeric') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';

  if (test.criticalHigh && num >= test.criticalHigh) return 'critical';
  if (test.criticalLow && num <= test.criticalLow) return 'critical';

  const rangeMatch = refRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    if (num < low) return 'low';
    if (num > high) return 'high';
    return 'normal';
  }
  const ltMatch = refRange.match(/[<]\s*([\d.]+)/);
  if (ltMatch && num > parseFloat(ltMatch[1])) return 'high';
  const gtMatch = refRange.match(/[>]\s*([\d.]+)/);
  if (gtMatch && num < parseFloat(gtMatch[1])) return 'low';
  return 'normal';
}

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const patients = patientStore.getAll();
  const doctors = doctorStore.getAll();
  const allTests = testStore.getAll();
  const profiles = profileStore.getAll();

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTests, setSelectedTests] = useState<ReportItem[]>([]);
  const [testSearchTerm, setTestSearchTerm] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => { setReports(reportStore.getAll()); }, []);

  const addTest = (test: Test) => {
    if (selectedTests.find(t => t.testId === test.id)) return;
    setSelectedTests(prev => [...prev, {
      testId: test.id, testName: test.name, result: '', unit: test.unit,
      referenceRange: test.referenceRange, flag: '', category: test.category,
    }]);
  };

  const addProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    profile.testIds.forEach(tid => {
      const test = allTests.find(t => t.id === tid);
      if (test) addTest(test);
    });
  };

  const updateResult = (index: number, value: string) => {
    setSelectedTests(prev => {
      const updated = [...prev];
      const test = allTests.find(t => t.id === updated[index].testId);
      updated[index] = { ...updated[index], result: value, flag: test ? getFlag(value, updated[index].referenceRange, test) : '' };
      return updated;
    });
  };

  const removeTest = (index: number) => {
    setSelectedTests(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!patient || selectedTests.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const allReports = reportStore.getAll();
    const report: Report = {
      id: generateId('rpt'),
      reportNumber: generateSequentialId('RPT-2024', allReports.map(r => r.reportNumber)),
      patientId: patient.id, patientName: patient.name, patientAge: patient.age, patientGender: patient.gender,
      doctorId: doctor?.id, doctorName: doctor?.name,
      items: selectedTests, status: selectedTests.every(t => t.result) ? 'pending' : 'draft',
      remarks, createdAt: today, updatedAt: today, sampleCollectionDate: today, reportDate: today,
    };
    reportStore.create(report);
    setReports(reportStore.getAll());
    setDialogOpen(false);
    setSelectedPatient('');
    setSelectedDoctor('');
    setSelectedTests([]);
    setRemarks('');
  };

  const updateStatus = (id: string, status: Report['status']) => {
    reportStore.update(id, { status, updatedAt: new Date().toISOString().split('T')[0] });
    setReports(reportStore.getAll());
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this report?')) return;
    reportStore.remove(id);
    setReports(reportStore.getAll());
  };

  const filtered = reports.filter(r => {
    const matchSearch = r.patientName.toLowerCase().includes(search.toLowerCase()) || r.reportNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning',
    verified: 'bg-info/10 text-info',
    printed: 'bg-success/10 text-success',
    delivered: 'bg-accent/10 text-accent',
  };

  const flagStyle: Record<string, string> = {
    high: 'text-high font-semibold',
    low: 'text-low font-semibold',
    critical: 'text-critical font-bold',
    normal: 'text-normal',
  };

  const filteredTestOptions = allTests.filter(t =>
    t.active && (t.name.toLowerCase().includes(testSearchTerm.toLowerCase()) || t.shortName.toLowerCase().includes(testSearchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-1" />Create Report</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="printed">Printed</option>
          <option value="delivered">Delivered</option>
        </select>
        <Badge variant="secondary" className="h-10 px-3 flex items-center">{filtered.length} reports</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Report #</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Age/Gender</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Doctor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tests</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No reports found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{r.reportNumber}</td>
                    <td className="p-3 font-medium text-foreground">{r.patientName}</td>
                    <td className="p-3">{r.patientAge} / {r.patientGender.charAt(0)}</td>
                    <td className="p-3">{r.doctorName || '-'}</td>
                    <td className="p-3">{r.items.length}</td>
                    <td className="p-3">
                      <select className={`text-xs rounded px-2 py-1 border-0 ${statusColor[r.status]}`} value={r.status} onChange={e => updateStatus(r.id, e.target.value as any)}>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="printed">Printed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3 text-xs">{r.reportDate}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" asChild><Link to={`/reports/${r.id}`}><Eye className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" asChild><Link to={`/reports/${r.id}/print`}><Printer className="w-4 h-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Report Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Report</DialogTitle></DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Patient *</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Doctor</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {/* Add profile quick select */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Quick Add Profile</label>
            <div className="flex flex-wrap gap-2">
              {profiles.slice(0, 12).map(p => (
                <Button key={p.id} variant="outline" size="sm" onClick={() => addProfile(p.id)} className="text-xs">
                  {p.profileCode || p.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Add individual tests */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Add Individual Tests</label>
            <Input placeholder="Search tests..." value={testSearchTerm} onChange={e => setTestSearchTerm(e.target.value)} />
            {testSearchTerm && (
              <div className="max-h-40 overflow-y-auto border border-border rounded-md divide-y divide-border">
                {filteredTestOptions.slice(0, 20).map(t => (
                  <button key={t.id} onClick={() => { addTest(t); setTestSearchTerm(''); }} className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex justify-between">
                    <span className="text-foreground">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected tests with result entry */}
          {selectedTests.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Test Results ({selectedTests.length})</label>
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Test</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground w-32">Result</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Unit</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Ref Range</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Flag</th>
                    <th className="p-2 w-8"></th>
                  </tr></thead>
                  <tbody>
                    {selectedTests.map((item, idx) => (
                      <tr key={idx} className={`border-b border-border ${item.flag === 'high' || item.flag === 'critical' ? 'bg-high' : item.flag === 'low' ? 'bg-low' : ''}`}>
                        <td className="p-2 text-xs font-medium text-foreground">{item.testName}</td>
                        <td className="p-2">
                          <Input className="h-8 text-xs" value={item.result} onChange={e => updateResult(idx, e.target.value)} placeholder="Enter value" />
                        </td>
                        <td className="p-2 text-xs">{item.unit}</td>
                        <td className="p-2 text-xs">{item.referenceRange}</td>
                        <td className="p-2 text-xs">
                          {item.flag && (
                            <span className={flagStyle[item.flag] || ''}>
                              {item.flag === 'high' ? 'H' : item.flag === 'low' ? 'L' : item.flag === 'critical' ? 'C' : 'N'}
                            </span>
                          )}
                        </td>
                        <td className="p-2"><button onClick={() => removeTest(idx)} className="text-destructive hover:text-destructive/80">×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Remarks</label>
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]" value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!selectedPatient || selectedTests.length === 0}>Create Report</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
