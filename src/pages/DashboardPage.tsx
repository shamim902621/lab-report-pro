import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Stethoscope, FileText, Receipt, TrendingUp,
  Clock, CheckCircle, Printer, Plus, DollarSign, TestTubes
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { patientStore, doctorStore, reportStore, invoiceStore } from '@/lib/store';

export default function DashboardPage() {
  const patients = patientStore.getAll();
  const doctors = doctorStore.getAll();
  const reports = reportStore.getAll();
  const invoices = invoiceStore.getAll();

  const today = new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(r => r.createdAt === today);
  const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'draft');
  const completedReports = reports.filter(r => r.status === 'verified' || r.status === 'printed' || r.status === 'delivered');
  const printedReports = reports.filter(r => r.status === 'printed' || r.status === 'delivered');
  const totalRevenue = invoices.reduce((s, i) => s + i.paidAmount, 0);

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-primary' },
    { label: 'Total Reports', value: reports.length, icon: FileText, color: 'text-info' },
    { label: 'Today Reports', value: todayReports.length, icon: Clock, color: 'text-warning' },
    { label: 'Pending', value: pendingReports.length, icon: Clock, color: 'text-destructive' },
    { label: 'Completed', value: completedReports.length, icon: CheckCircle, color: 'text-success' },
    { label: 'Printed', value: printedReports.length, icon: Printer, color: 'text-accent' },
    { label: 'Doctors', value: doctors.length, icon: Stethoscope, color: 'text-primary' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
  ];

  const quickActions = [
    { label: 'Add Patient', path: '/patients?action=add', icon: Plus },
    { label: 'Create Report', path: '/reports?action=add', icon: FileText },
    { label: 'Add Doctor', path: '/doctors?action=add', icon: Stethoscope },
    { label: 'Create Invoice', path: '/invoices?action=add', icon: Receipt },
  ];

  const statusColor: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning',
    verified: 'bg-info/10 text-info',
    printed: 'bg-success/10 text-success',
    delivered: 'bg-accent/10 text-accent',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back to LifeCare Diagnostics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map(a => (
          <Button key={a.label} variant="outline" size="sm" asChild>
            <Link to={a.path}><a.icon className="w-4 h-4 mr-1" />{a.label}</Link>
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No reports yet</p>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 6).map(r => (
                  <Link to={`/reports/${r.id}`} key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-muted/50 px-2 rounded-md -mx-2 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.patientName}</p>
                      <p className="text-xs text-muted-foreground">{r.reportNumber} · {r.items.length} tests</p>
                    </div>
                    <Badge variant="secondary" className={statusColor[r.status]}>{r.status}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 6).map(inv => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.patientName}</p>
                      <p className="text-xs text-muted-foreground">{inv.invoiceNumber} · ₹{inv.totalAmount}</p>
                    </div>
                    <Badge variant="secondary" className={
                      inv.paymentStatus === 'paid' ? 'bg-success/10 text-success' :
                      inv.paymentStatus === 'partial' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }>{inv.paymentStatus}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
