import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings, updateSettings } from '@/lib/store';
import { LabSettings } from '@/types';

export default function SettingsPage() {
  const [form, setForm] = useState<LabSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Lab Settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Lab Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1"><label className="text-xs font-medium text-foreground">Lab Name</label><Input value={form.labName} onChange={e => setForm({ ...form, labName: e.target.value })} /></div>
          <div className="space-y-1"><label className="text-xs font-medium text-foreground">Address</label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Phone</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Email</label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Website</label><Input value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">Registration No.</label><Input value={form.registrationNumber || ''} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-foreground">NABL No.</label><Input value={form.nablNumber || ''} onChange={e => setForm({ ...form, nablNumber: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Report Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1"><label className="text-xs font-medium text-foreground">Pathologist Name</label><Input value={form.pathologistName} onChange={e => setForm({ ...form, pathologistName: e.target.value })} /></div>
          <div className="space-y-1"><label className="text-xs font-medium text-foreground">Qualification</label><Input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} /></div>
          <div className="space-y-1"><label className="text-xs font-medium text-foreground">Footer Note</label>
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={form.footerNote} onChange={e => setForm({ ...form, footerNote: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave}><Save className="w-4 h-4 mr-1" />{saved ? 'Saved!' : 'Save Settings'}</Button>
      </div>
    </div>
  );
}
