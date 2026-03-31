import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { doctorStore, generateId } from '@/lib/store';
import { Doctor } from '@/types';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState({ name: '', specialization: '', clinicName: '', mobile: '', email: '', address: '', referralCode: '', notes: '' });

  useEffect(() => { setDoctors(doctorStore.getAll()); }, []);

  const resetForm = () => setForm({ name: '', specialization: '', clinicName: '', mobile: '', email: '', address: '', referralCode: '', notes: '' });

  const openAdd = () => { resetForm(); setEditing(null); setDialogOpen(true); };
  const openEdit = (d: Doctor) => {
    setForm({ name: d.name, specialization: d.specialization, clinicName: d.clinicName || '', mobile: d.mobile, email: d.email || '', address: d.address || '', referralCode: d.referralCode, notes: d.notes || '' });
    setEditing(d);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) return;
    if (editing) {
      doctorStore.update(editing.id, form);
    } else {
      doctorStore.create({ id: generateId('doc'), ...form });
    }
    setDoctors(doctorStore.getAll());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this doctor?')) return;
    doctorStore.remove(id);
    setDoctors(doctorStore.getAll());
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.mobile.includes(search) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Doctors / Referrals</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Doctor</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Badge variant="secondary" className="h-10 px-3 flex items-center">{filtered.length} doctors</Badge>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Specialization</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Clinic</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Mobile</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No doctors found</td></tr>
                ) : filtered.map(d => (
                  <tr key={d.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{d.name}</td>
                    <td className="p-3">{d.specialization}</td>
                    <td className="p-3">{d.clinicName || '-'}</td>
                    <td className="p-3">{d.mobile}</td>
                    <td className="p-3 font-mono text-xs">{d.referralCode}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1"><label className="text-xs font-medium text-foreground">Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Specialization</label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Clinic/Hospital</label><Input value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Mobile *</label><Input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Email</label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Referral Code</label><Input value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add Doctor'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
