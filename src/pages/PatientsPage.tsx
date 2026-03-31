import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { patientStore, doctorStore, generateId, generateSequentialId } from '@/lib/store';
import { Patient } from '@/types';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const doctors = doctorStore.getAll();

  useEffect(() => { setPatients(patientStore.getAll()); }, []);

  const [form, setForm] = useState({ name: '', age: '', gender: 'Male' as 'Male' | 'Female' | 'Other', mobile: '', email: '', address: '', city: '', referredBy: '', uhid: '', notes: '' });

  const resetForm = () => setForm({ name: '', age: '', gender: 'Male', mobile: '', email: '', address: '', city: '', referredBy: '', uhid: '', notes: '' });

  const openAdd = () => { resetForm(); setEditing(null); setDialogOpen(true); };
  const openEdit = (p: Patient) => {
    setForm({ name: p.name, age: String(p.age), gender: p.gender, mobile: p.mobile, email: p.email || '', address: p.address || '', city: p.city || '', referredBy: p.referredBy || '', uhid: p.uhid, notes: p.notes || '' });
    setEditing(p);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.age || !form.mobile) return;
    if (editing) {
      patientStore.update(editing.id, { ...form, age: Number(form.age) });
    } else {
      const allPats = patientStore.getAll();
      patientStore.create({
        id: generateId('pat'),
        patientId: generateSequentialId('P-2024', allPats.map(p => p.patientId)),
        uhid: form.uhid || generateSequentialId('LC-', allPats.map(p => p.uhid)),
        name: form.name, age: Number(form.age), gender: form.gender as any,
        mobile: form.mobile, email: form.email, address: form.address, city: form.city,
        referredBy: form.referredBy, notes: form.notes,
        registrationDate: new Date().toISOString().split('T')[0],
      });
    }
    setPatients(patientStore.getAll());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this patient?')) return;
    patientStore.remove(id);
    setPatients(patientStore.getAll());
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile.includes(search) ||
    p.patientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Patients</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Patient</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, mobile, ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Badge variant="secondary" className="h-10 px-3 flex items-center">{filtered.length} patients</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Age/Gender</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Mobile</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Ref. Doctor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No patients found</td></tr>
                ) : filtered.map(p => {
                  const doc = doctors.find(d => d.id === p.referredBy);
                  return (
                    <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{p.patientId}</td>
                      <td className="p-3 font-medium text-foreground">{p.name}</td>
                      <td className="p-3">{p.age} / {p.gender.charAt(0)}</td>
                      <td className="p-3">{p.mobile}</td>
                      <td className="p-3">{p.city || '-'}</td>
                      <td className="p-3">{doc?.name || '-'}</td>
                      <td className="p-3">{p.registrationDate}</td>
                      <td className="p-3 text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-foreground">Full Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Age *</label>
              <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Gender *</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as any })}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Mobile *</label>
              <Input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email</label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-foreground">Address</label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">City</label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Referred By</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.referredBy} onChange={e => setForm({ ...form, referredBy: e.target.value })}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">UHID</label>
              <Input value={form.uhid} onChange={e => setForm({ ...form, uhid: e.target.value })} placeholder="Auto-generated if empty" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add Patient'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
