import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, Users, Stethoscope, Receipt, Eye, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { patientStore, doctorStore, reportStore, invoiceStore } from '@/lib/store';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase().trim();

  const patients = q ? patientStore.getAll().filter(p => p.name.toLowerCase().includes(q) || p.mobile.includes(q) || p.patientId.toLowerCase().includes(q)) : [];
  const doctors = q ? doctorStore.getAll().filter(d => d.name.toLowerCase().includes(q) || d.mobile.includes(q)) : [];
  const reports = q ? reportStore.getAll().filter(r => r.patientName.toLowerCase().includes(q) || r.reportNumber.toLowerCase().includes(q)) : [];
  const invoices = q ? invoiceStore.getAll().filter(i => i.patientName.toLowerCase().includes(q) || i.invoiceNumber.toLowerCase().includes(q)) : [];

  const total = patients.length + doctors.length + reports.length + invoices.length;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Global Search</h1>
      <div className="relative max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input className="pl-10 h-12 text-base" placeholder="Search patients, doctors, reports, invoices..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
      </div>

      {q && <p className="text-sm text-muted-foreground">{total} results for "{query}"</p>}

      {patients.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" />Patients ({patients.length})</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {patients.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div><p className="text-sm font-medium text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.patientId} · {p.mobile}</p></div>
                <Badge variant="secondary">{p.age}/{p.gender.charAt(0)}</Badge>
              </div>
            ))}
          </div></CardContent>
        </Card>
      )}

      {reports.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Reports ({reports.length})</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {reports.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div><p className="text-sm font-medium text-foreground">{r.patientName}</p><p className="text-xs text-muted-foreground">{r.reportNumber} · {r.items.length} tests</p></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild><Link to={`/reports/${r.id}`}><Eye className="w-4 h-4" /></Link></Button>
                  <Button variant="ghost" size="sm" asChild><Link to={`/reports/${r.id}/print`}><Printer className="w-4 h-4" /></Link></Button>
                </div>
              </div>
            ))}
          </div></CardContent>
        </Card>
      )}

      {doctors.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Stethoscope className="w-4 h-4" />Doctors ({doctors.length})</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {doctors.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div><p className="text-sm font-medium text-foreground">{d.name}</p><p className="text-xs text-muted-foreground">{d.specialization} · {d.mobile}</p></div>
              </div>
            ))}
          </div></CardContent>
        </Card>
      )}

      {invoices.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Receipt className="w-4 h-4" />Invoices ({invoices.length})</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {invoices.map(i => (
              <div key={i.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div><p className="text-sm font-medium text-foreground">{i.patientName}</p><p className="text-xs text-muted-foreground">{i.invoiceNumber} · ₹{i.totalAmount}</p></div>
                <Badge variant="secondary" className={i.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>{i.paymentStatus}</Badge>
              </div>
            ))}
          </div></CardContent>
        </Card>
      )}

      {q && total === 0 && <p className="text-center py-8 text-muted-foreground">No results found</p>}
    </div>
  );
}
