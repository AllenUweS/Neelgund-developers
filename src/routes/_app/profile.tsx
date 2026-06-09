import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Neelgund Developers" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile: p, role } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const photoUrl = p?.profile_photo_url ?? p?.avatar_url ?? null;

  // Init form from profile
  if (p && !form) setForm({ name: p.name ?? "", phone: p.phone ?? "", designation: p.designation ?? "", department: p.department ?? "", profile_notes: p.profile_notes ?? "" });

  const save = async () => {
    if (!user || !form) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      name: form.name, phone: form.phone, designation: form.designation,
      department: form.department, profile_notes: form.profile_notes, updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (file.size > 5 * 1024 * 1024) return toast.error("File too large. Max 5MB.");
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return toast.error("Invalid file type.");

    setUploading(true);
    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `profile-photos/${user.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: true, contentType: file.type });
      
      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from("documents").getPublicUrl(path);
      
      const { error: updateError } = await supabase.from("profiles")
        .update({ profile_photo_url: data.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);
        
      if (updateError) throw new Error(updateError.message);
      
      toast.success("Profile photo updated! Please refresh to see changes everywhere.");
      // Soft reload to update auth context if needed, or rely on next fetch
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  if (!form) return <div className="text-sm text-muted-foreground p-6">Loading...</div>;
  return (
    <>
      <PageHeader title="Your Profile" subtitle="Update your personal information." />
      <Card className="p-6 rounded-2xl max-w-xl">
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
          <div className="relative group shrink-0">
            <div className="h-20 w-20 rounded-full bg-[#154D8C] flex items-center justify-center text-white text-2xl font-bold shadow-md overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                p?.name?.[0]?.toUpperCase() ?? "?"
              )}
            </div>
            <label className="absolute inset-0 rounded-full bg-[#154D8C]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
              <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{p?.name || "Employee"}</h3>
            <p className="text-sm text-gray-500">{p?.email}</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">Hover photo to change</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label className="text-xs">Full Name</Label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 rounded-xl h-10" />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1 rounded-xl h-10" />
          </div>
          <div>
            <Label className="text-xs">Designation</Label>
            <Input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="mt-1 rounded-xl h-10" />
          </div>
          <div>
            <Label className="text-xs">Department</Label>
            <Input value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="mt-1 rounded-xl h-10" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={p?.email ?? ""} disabled className="mt-1 rounded-xl h-10 opacity-60" />
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Input value={role ?? ""} disabled className="mt-1 rounded-xl h-10 opacity-60 capitalize" />
          </div>
          <div>
            <Label className="text-xs">Joining Date</Label>
            <Input value={p?.joining_date ?? ""} disabled className="mt-1 rounded-xl h-10 opacity-60" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.profile_notes} onChange={e => setForm({...form, profile_notes: e.target.value})} className="mt-1 rounded-xl resize-none" rows={3} />
          </div>
        </div>
        <Button onClick={save} disabled={busy} className="mt-5 rounded-xl">{busy ? "Saving…" : "Save changes"}</Button>
      </Card>
    </>
  );
}
