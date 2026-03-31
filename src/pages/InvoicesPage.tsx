import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { invoiceStore, patientStore, generateId, generateSequentialId } from '@/lib/store';
import { Invoice, PaymentMode, PaymentStatus } from '@/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const patients = patientStore.getAll();

  const [form, setForm] = useState({
    patientId: '', items: [{ name: '', amount: 0 }] as { name: string; amount: number }[],
    discount: 0, paidAmount: 0, paymentMode: 'cash' as PaymentMode,
  });

  useEffect(() => { setInvoices(invoiceStore.getAll()); }, []);

  const total = form.items.reduce((s, i) => s + i.amount, 0);
  const due = total - form.discount - form.paidAmount;

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { name: '', amount: 0 }] }));
  const updateItem = (idx: number, field: string, val: any) => {
    setForm(f => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [field]: field === 'amount' ? Number(val) : val } : item) }));
  };
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleCreate = () => {
    const patient = patients.find(p => p.id === form.patientId);
    if (!patient || form.items.length === 0) return;
    const allInv = invoiceStore.getAll();
    const status: PaymentStatus = due <= 0 ? 'paid' : form.paidAmount > 0 ? 'partial' : 'unpaid';
    invoiceStore.create({
      id: generateId('inv'),
      invoiceNumber: generateSequentialId('INV-2024', allInv.map(i => i.invoiceNumber)),
      patientId: patient.id, patientName: patient.name,
      items: form.items.filter(i => i.name), totalAmount: total, discount: form.discount,
      paidAmount: form.paidAmount, dueAmount: Math.max(0, due),
      paymentMode: form.paymentMode, paymentStatus: status,
      invoiceDate: new Date().toISOString().split('T')[0],
    });
    setInvoices(invoiceStore.getAll());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete?')) return;
    invoiceStore.remove(id);
    setInvoices(invoiceStore.getAll());
  };

  const filtered = invoices.filter(i =>
    i.patientName.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
        <Button onClick={() => { setForm({ patientId: '', items: [{ name: '', amount: 0 }], discount: 0, paidAmount: 0, paymentMode: 'cash' }); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" />Create Invoice
        </Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Invoice #</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Paid</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Due</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Mode</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No invoices found</td></tr>
              ) : filtered.map(inv => (
                <tr key={inv.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="p-3 font-medium text-foreground">{inv.patientName}</td>
                  <td className="p-3">₹{inv.totalAmount}</td>
                  <td className="p-3">₹{inv.paidAmount}</td>
                  <td className="p-3">₹{inv.dueAmount}</td>
                  <td className="p-3 uppercase text-xs">{inv.paymentMode}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className={
                      inv.paymentStatus === 'paid' ? 'bg-success/10 text-success' :
                      inv.paymentStatus === 'partial' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }>{inv.paymentStatus}</Badge>
                  </td>
                  <td className="p-3 text-xs">{inv.invoiceDate}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Patient *</label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Items</label>
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <Input placeholder="Test/Profile" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} className="flex-1" />
                  <Input type="number" placeholder="Amount" value={item.amount || ''} onChange={e => updateItem(idx, 'amount', e.target.value)} className="w-24" />
                  {form.items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>×</Button>}
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2" onClick={addItem}>+ Add Item</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Discount (₹)</label>
                <Input type="number" value={form.discount || ''} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Paid Amount (₹)</label>
                <Input type="number" value={form.paidAmount || ''} onChange={e => setForm({ ...form, paidAmount: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Payment Mode</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.paymentMode} onChange={e => setForm({ ...form, paymentMode: e.target.value as PaymentMode })}>
                  <option value="cash">Cash</option><option value="card">Card</option><option value="upi">UPI</option><option value="netbanking">Net Banking</option>
                </select>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Total: ₹{total}</p>
                <p className="text-xs text-muted-foreground">Due: ₹{Math.max(0, due)}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Invoice</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
