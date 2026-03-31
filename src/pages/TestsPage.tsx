import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { testStore, generateId } from '@/lib/store';
import { Test, ResultType } from '@/types';
import { testCategories } from '@/data/seedTests';

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Test | null>(null);

  const defaultForm = { name: '', shortName: '', testCode: '', category: '', department: '', sampleType: 'Blood', unit: '', referenceRange: '', maleRange: '', femaleRange: '', childRange: '', resultType: 'numeric' as ResultType, price: '100', active: true };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => { setTests(testStore.getAll()); }, []);

  const openAdd = () => { setForm(defaultForm); setEditing(null); setDialogOpen(true); };
  const openEdit = (t: Test) => {
    setForm({ name: t.name, shortName: t.shortName, testCode: t.testCode, category: t.category, department: t.department, sampleType: t.sampleType, unit: t.unit, referenceRange: t.referenceRange, maleRange: t.maleRange || '', femaleRange: t.femaleRange || '', childRange: t.childRange || '', resultType: t.resultType, price: String(t.price), active: t.active });
    setEditing(t);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const data: any = { ...form, price: Number(form.price) };
    if (editing) {
      testStore.update(editing.id, data);
    } else {
      testStore.create({ id: generateId('test'), printSequence: tests.length + 1, ...data });
    }
    setTests(testStore.getAll());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this test?')) return;
    testStore.remove(id);
    setTests(testStore.getAll());
  };

  const filtered = tests.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.testCode.toLowerCase().includes(search.toLowerCase()) || t.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !catFilter || t.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const categories = [...new Set(tests.map(t => t.category))];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Test Master</h1>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Test</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Badge variant="secondary" className="h-10 px-3 flex items-center">{filtered.length} tests</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Test Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Sample</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Unit</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Reference Range</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">₹</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No tests found</td></tr>
                ) : filtered.slice(0, 50).map(t => (
                  <tr key={t.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{t.testCode}</td>
                    <td className="p-3 font-medium text-foreground">{t.name}</td>
                    <td className="p-3"><Badge variant="secondary" className="text-xs">{t.category}</Badge></td>
                    <td className="p-3">{t.sampleType}</td>
                    <td className="p-3">{t.unit || '-'}</td>
                    <td className="p-3 text-xs">{t.referenceRange || '-'}</td>
                    <td className="p-3 text-xs capitalize">{t.resultType}</td>
                    <td className="p-3">{t.price}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 50 && <p className="text-center text-xs text-muted-foreground py-3">Showing 50 of {filtered.length} results. Use search to narrow down.</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Test' : 'Add Test'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1"><label className="text-xs font-medium text-foreground">Test Name *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Short Name</label><Input value={form.shortName} onChange={e => setForm({ ...form, shortName: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Test Code</label><Input value={form.testCode} onChange={e => setForm({ ...form, testCode: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Category</label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} list="cats" /><datalist id="cats">{testCategories.map(c => <option key={c} value={c} />)}</datalist></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Department</label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Sample Type</label><Input value={form.sampleType} onChange={e => setForm({ ...form, sampleType: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Unit</label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
            <div className="col-span-2 space-y-1"><label className="text-xs font-medium text-foreground">Reference Range</label><Input value={form.referenceRange} onChange={e => setForm({ ...form, referenceRange: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Male Range</label><Input value={form.maleRange} onChange={e => setForm({ ...form, maleRange: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Female Range</label><Input value={form.femaleRange} onChange={e => setForm({ ...form, femaleRange: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Result Type</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.resultType} onChange={e => setForm({ ...form, resultType: e.target.value as ResultType })}>
                <option value="numeric">Numeric</option><option value="text">Text</option><option value="positive_negative">Positive/Negative</option><option value="dropdown">Dropdown</option>
              </select>
            </div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Price (₹)</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Add Test'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
