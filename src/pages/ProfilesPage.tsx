import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { profileStore, testStore, generateId } from '@/lib/store';
import { Profile, Test } from '@/types';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', profileCode: '', category: '', price: '0', description: '', testIds: [] as string[] });
  const [testSearch, setTestSearch] = useState('');
  const allTests = testStore.getAll();

  useEffect(() => { setProfiles(profileStore.getAll()); }, []);

  const openAdd = () => {
    setForm({ name: '', profileCode: '', category: '', price: '0', description: '', testIds: [] });
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Profile) => {
    setForm({ name: p.name, profileCode: p.profileCode, category: p.category, price: String(p.price), description: p.description || '', testIds: [...p.testIds] });
    setEditing(p);
    setDialogOpen(true);
  };

  const toggleTest = (id: string) => {
    setForm(f => ({
      ...f,
      testIds: f.testIds.includes(id) ? f.testIds.filter(t => t !== id) : [...f.testIds, id]
    }));
  };

  const handleSave = () => {
    if (!form.name) return;
    const data = { name: form.name, profileCode: form.profileCode, category: form.category, price: Number(form.price), description: form.description, testIds: form.testIds };
    if (editing) {
      profileStore.update(editing.id, data);
    } else {
      profileStore.create({ id: generateId('profile'), ...data });
    }
    setProfiles(profileStore.getAll());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this profile?')) return;
    profileStore.remove(id);
    setProfiles(profileStore.getAll());
  };

  const filtered = profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.profileCode.toLowerCase().includes(search.toLowerCase()));
  const filteredTests = allTests.filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase()) || t.shortName.toLowerCase().includes(testSearch.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Profiles / Panels</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Profile</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search profiles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Badge variant="secondary" className="h-10 px-3 flex items-center">{filtered.length} profiles</Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{p.profileCode}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary">{p.testIds.length} tests</Badge>
                <Badge variant="secondary">₹{p.price}</Badge>
                {p.category && <Badge variant="outline" className="text-xs">{p.category}</Badge>}
              </div>
              {p.description && <p className="text-xs text-muted-foreground mt-2">{p.description}</p>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No profiles found</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Profile' : 'Add Profile'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1"><label className="text-xs font-medium text-foreground">Profile Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Profile Code</label><Input value={form.profileCode} onChange={e => setForm({ ...form, profileCode: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Category</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Price (₹)</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Description</label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-foreground">Select Tests ({form.testIds.length} selected)</label>
            <Input className="mt-2" placeholder="Search tests to add..." value={testSearch} onChange={e => setTestSearch(e.target.value)} />
            <div className="mt-2 max-h-60 overflow-y-auto border border-border rounded-md divide-y divide-border">
              {filteredTests.slice(0, 50).map(t => (
                <label key={t.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.testIds.includes(t.id)} onChange={() => toggleTest(t.id)} className="rounded" />
                  <span className="text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create Profile'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
