// HR Management page – admin/HR can view, add, and edit users based on role.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, UserPlus, Phone, Briefcase, Building2, Camera, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/hr-management")({
  head: () => ({ meta: [{ title: "HR Management — Neelgund Developers" }] }),
  component: HRManagementPage,
});

type RoleFilter = "All" | "Admins" | "Managers" | "HR" | "Employees" | "Transport";
const ROLES = ["employee", "manager", "hr", "admin", "super_admin", "transport"] as const;
const ROLE_ORDER = ["super_admin", "admin", "manager", "hr", "employee", "transport"] as const;
const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  hr: "HR",
  employee: "Employee",
  transport: "Transport",
};
const FILTERS = [
  { label: "All", roles: null },
  { label: "Admins", roles: ["admin", "super_admin"] },
  { label: "Managers", roles: ["manager"] },
  { label: "HR", roles: ["hr"] },
  { label: "Employees", roles: ["employee"] },
  { label: "Transport", roles: ["transport"] },
] as const;

const PRIMARY_COLOR = "#154D8C";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ─── helpers ─────────────────────────────────────────────────────────────────

function resolvePhotoUrl(profile: any): string | null {
  return profile?.profile_photo_url ?? profile?.avatar_url ?? null;
}

async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large. Max allowed size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`);
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WEBP or GIF image.");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `profile-photos/${userId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("documents").getPublicUrl(path);
  return data.publicUrl;
}

async function saveProfilePhotoUrl(userId: string, photoUrl: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ profile_photo_url: photoUrl, updated_at: new Date().toISOString() } as any)
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

// ─── AvatarUploadButton ───────────────────────────────────────────────────────

interface AvatarUploadButtonProps {
  userId: string;
  currentUrl: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  canEdit: boolean;
  onUpdated: (newUrl: string) => void;
  onClick?: (e: React.MouseEvent) => void;
}

function AvatarUploadButton({ userId, currentUrl, name, size = "md", canEdit, onUpdated, onClick }: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const dim = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";
  const cameraSize = size === "lg" ? 16 : 12;
  const displayUrl = preview ?? currentUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const publicUrl = await uploadProfilePhoto(file, userId);
      await saveProfilePhotoUrl(userId, publicUrl);
      onUpdated(publicUrl);
      toast.success("Profile photo updated!");
    } catch (err: any) {
      setPreview(null);
      toast.error(err?.message ?? "Failed to upload photo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <div className="relative shrink-0 group" style={{ width: size === "sm" ? 40 : size === "lg" ? 80 : 56 }} onClick={handleClick}>
      <div
        className={`${dim} rounded-full flex items-center justify-center font-semibold text-white shadow-md overflow-hidden select-none`}
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        {displayUrl ? (
          <img src={displayUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{name?.[0]?.toUpperCase() ?? "?"}</span>
        )}
      </div>
      {canEdit && (
        <>
          <button
            type="button"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: "rgba(21,77,140,0.72)" }}
            title="Change photo"
          >
            {uploading ? (
              <Loader2 size={cameraSize} className="text-white animate-spin" />
            ) : (
              <Camera size={cameraSize} className="text-white" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}

// ─── EditUserDialog (Full Edit Capabilities) ─────────────────────────────────

interface EditUserDialogProps {
  user: any;
  managers: any[];
  open: boolean;
  onClose: () => void;
  onSaved: (updated: any) => void;
  onDelete?: (user: any) => void;
}

function EditUserDialog({ user, managers, open, onClose, onSaved, onDelete }: EditUserDialogProps) {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === "admin" || myRole === "super_admin";
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        phone: user.phone ?? "",
        designation: user.designation ?? "",
        department: user.department ?? "",
        role: user.role ?? "employee",
        manager_id: user.manager_id ?? "",
        profile_notes: user.profile_notes ?? "",
        joining_date: user.joining_date ?? "",
      });
      setPhotoUrl(resolvePhotoUrl(user));
    }
  }, [user]);

  const save = async () => {
    if (!form.name?.trim()) return toast.error("Name is required");
    if (!form.email?.trim()) return toast.error("Email is required");

    setBusy(true);

    try {
      // Step 1: Update profile fields directly in Supabase (mirrors mobile API PUT /users/:id logic)
      const patch: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        phone: form.phone?.trim() || null,
        department: form.department?.trim() || null,
        designation: form.designation?.trim() || null,
        manager_id: form.manager_id || null,
        joining_date: form.joining_date || null,
        profile_notes: form.profile_notes?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedProfile, error: profileErr } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id)
        .select()
        .single();

      if (profileErr) throw new Error(profileErr.message);

      // Step 2: If password provided, use edge function only for the auth password reset
      if (form.password?.trim()) {
        if (form.password.trim().length < 8) throw new Error("Password must be at least 8 characters");
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ action: "reset_password", id: user.id, password: form.password.trim() }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Profile saved but password update failed");
      }

      toast.success("User updated successfully");
      onSaved({ ...updatedProfile, profile_photo_url: photoUrl });
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update user");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: PRIMARY_COLOR }}>Edit User</DialogTitle>
        </DialogHeader>

        {/* Avatar section */}
        <div className="flex items-center gap-4 py-2 border-b" style={{ borderColor: `${PRIMARY_COLOR}20` }}>
          <AvatarUploadButton
            userId={user.id}
            currentUrl={photoUrl}
            name={user.name ?? ""}
            size="lg"
            canEdit={true}
            onUpdated={(url) => setPhotoUrl(url)}
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: PRIMARY_COLOR }}>
              Hover the photo to change it
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Full Name *</Label>
              <Input 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Email *</Label>
              <Input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Password (leave blank to keep current)</Label>
              <Input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                placeholder="Enter new password to change" 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger className="mt-1 rounded-xl h-10" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-600">Phone</Label>
              <Input 
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Department</Label>
              <Input 
                value={form.department} 
                onChange={e => setForm({ ...form, department: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Designation</Label>
              <Input 
                value={form.designation} 
                onChange={e => setForm({ ...form, designation: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Joining Date</Label>
              <Input 
                type="date" 
                value={form.joining_date} 
                onChange={e => setForm({ ...form, joining_date: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
            {managers.length > 0 && (
              <div className="col-span-2">
                <Label className="text-xs text-slate-600">Assign Manager</Label>
                <Select value={form.manager_id} onValueChange={v => setForm({ ...form, manager_id: v })}>
                  <SelectTrigger className="mt-1 rounded-xl h-10" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                    <SelectValue placeholder="Select manager…" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2">
              <Label className="text-xs text-slate-600">Notes</Label>
              <Input 
                value={form.profile_notes} 
                onChange={e => setForm({ ...form, profile_notes: e.target.value })} 
                className="mt-1 rounded-xl h-10" 
                style={{ borderColor: `${PRIMARY_COLOR}30` }} 
                onFocus={e => e.target.style.borderColor = PRIMARY_COLOR} 
                onBlur={e => e.target.style.borderColor = `${PRIMARY_COLOR}30`} 
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => { onClose(); onDelete(user); }}
              className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />Delete Employee
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button 
            onClick={save} 
            disabled={busy} 
            className="rounded-xl text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0e3a6b"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
          >
            {busy ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── HRManagementPage ─────────────────────────────────────────────────────────

function HRManagementPage() {
  const { role: myRole } = useAuth();
  const canAccess = ["hr", "admin", "super_admin"].includes(myRole ?? "");
  const canCreate = canAccess;
  const canEdit = canAccess;

  const [list, setList] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [activeRole, setActiveRole] = useState<RoleFilter>("All");
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee", phone: "", department: "", designation: "", manager_id: "" });
  const [busy, setBusy] = useState(false);
  const [createPhotoFile, setCreatePhotoFile] = useState<File | null>(null);
  const [createPhotoPreview, setCreatePhotoPreview] = useState<string | null>(null);
  const createPhotoInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const updateUserInList = (updated: any) =>
    setList(prev => prev.map(e => e.id === updated.id ? { ...e, ...updated } : e));

  const updatePhotoInList = (userId: string, newUrl: string) =>
    setList(prev => prev.map(e => e.id === userId ? { ...e, profile_photo_url: newUrl } : e));

  const roleRank: Record<string, number> = {
    super_admin: 0,
    admin: 1,
    manager: 2,
    hr: 3,
    employee: 4,
    transport: 5,
  };

  const filtered = useMemo(() => {
    let result = list;

    if (q) {
      result = result.filter(e => [e.name, e.email, e.designation, e.department].some((v: any) => v?.toLowerCase().includes(q.toLowerCase())));
    }

    if (activeRole !== "All") {
      const roles = FILTERS.find(f => f.label === activeRole)?.roles;
      if (roles) result = result.filter(e => roles.includes(e.role));
    }

    return [...result].sort((a, b) => {
      const rank = (roleRank[a.role] ?? 99) - (roleRank[b.role] ?? 99);
      return rank || a.name.localeCompare(b.name);
    });
  }, [list, q, activeRole]);

  // Load users and managers list
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("name");
    if (error) toast.error(error.message);
    setList(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    supabase.from("profiles").select("id, name, email").eq("role", "manager").then(({ data }) => setManagers(data ?? []));
  }, []);

  // Create new user
  const createUser = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Name, email and password required");
    setBusy(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        action: "create",
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone || null,
        department: form.department || null,
        designation: form.designation || null,
        managerId: form.manager_id || null,
      }),
    });
    const json = await res.json();
    if (!res.ok) { setBusy(false); toast.error(json.error ?? "Failed to create"); return; }

    // Upload photo if one was selected (mirrors mobile create flow)
    if (createPhotoFile && json.id) {
      try {
        const publicUrl = await uploadProfilePhoto(createPhotoFile, json.id);
        await saveProfilePhotoUrl(json.id, publicUrl);
      } catch (err: any) {
        toast.warning("User created but photo upload failed: " + (err?.message ?? "Unknown error"));
      }
    }

    setBusy(false);
    toast.success("User created");
    setCreateOpen(false);
    setForm({ name: "", email: "", password: "", role: "employee", phone: "", department: "", designation: "", manager_id: "" });
    setCreatePhotoFile(null);
    setCreatePhotoPreview(null);
    load();
  };

  // Delete user — uses edge function delete action (already exists in mobile edge fn)
  const deleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "delete", id: userToDelete.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to delete");
      toast.success(`${userToDelete.name} has been deleted`);
      setList(prev => prev.filter(e => e.id !== userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      if (selectedUser?.id === userToDelete.id) {
        setEditOpen(false);
        setSelectedUser(null);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  if (!canAccess) return <div className="p-8 text-muted-foreground">You do not have permission to view HR Management.</div>;

  return (
    <>
      <PageHeader title="HR Management" subtitle={`${list.length} users`} action={canCreate && (
        <Button 
          className="rounded-xl gap-2 text-white" 
          style={{ backgroundColor: PRIMARY_COLOR }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e3a6b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
          onClick={() => setCreateOpen(true)}
        >
          <UserPlus className="h-4 w-4" />Add User
        </Button>
      )} />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(filter => {
          const count = filter.roles ? list.filter(e => filter.roles?.includes(e.role)).length : list.length;
          const active = activeRole === filter.label;
          return (
            <button
              key={filter.label}
              type="button"
              onClick={() => setActiveRole(filter.label)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition duration-200 ${
                active 
                  ? "text-white shadow-lg" 
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              style={active ? { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR } : {}}
            >
              {filter.label} 
              <span 
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  active 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}
                style={!active ? { backgroundColor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR } : {}}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: PRIMARY_COLOR }} />
        <Input 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder="Search name, email, etc…" 
          className="pl-8 rounded-xl h-9 text-sm"
          style={{ borderColor: `${PRIMARY_COLOR}30` }}
          onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
          onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
        />
      </div>

      <div className="space-y-6">
        {ROLE_ORDER.map(roleKey => {
          const group = filtered.filter(e => e.role === roleKey);
          if (group.length === 0) return null;
          return (
            <section key={roleKey} className="overflow-hidden rounded-3xl border p-4 shadow-sm" style={{ borderColor: `${PRIMARY_COLOR}20`, backgroundColor: `${PRIMARY_COLOR}05` }}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: PRIMARY_COLOR }}>{ROLE_LABEL[roleKey]}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{group.length} {group.length === 1 ? "member" : "members"}</h2>
                </div>
                <Badge 
                  variant="secondary" 
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] shadow-sm"
                  style={{ backgroundColor: `${PRIMARY_COLOR}10`, borderColor: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}
                >
                  {ROLE_LABEL[roleKey]}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.map((e, i) => (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} whileTap={{ scale: 0.995 }} transition={{ delay: i * 0.02, duration: 0.2 }}>
                    <Card 
                      onClick={() => handleCardClick(e)} 
                      className="cursor-pointer p-4 rounded-3xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
                      style={{ borderColor: `${PRIMARY_COLOR}20` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = PRIMARY_COLOR}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = `${PRIMARY_COLOR}20`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar with upload */}
                        <AvatarUploadButton
                          userId={e.id}
                          currentUrl={resolvePhotoUrl(e)}
                          name={e.name ?? ""}
                          size="sm"
                          canEdit={canEdit}
                          onUpdated={url => updatePhotoInList(e.id, url)}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold text-sm text-slate-900">{e.name}</div>
                            <span 
                              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white"
                              style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                              {e.role?.replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{e.email}</div>
                          {e.designation && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Briefcase className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.designation}</div>}
                          {e.department && <div className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.department}</div>}
                          {e.phone && <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.phone}</div>}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) { setCreatePhotoFile(null); setCreatePhotoPreview(null); } }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle style={{ color: PRIMARY_COLOR }}>Add Employee</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-2 pb-3 border-b" style={{ borderColor: `${PRIMARY_COLOR}20` }}>
              <div
                className="relative h-20 w-20 rounded-full overflow-hidden cursor-pointer group shadow-md"
                style={{ backgroundColor: PRIMARY_COLOR }}
                onClick={() => createPhotoInputRef.current?.click()}
              >
                {createPhotoPreview ? (
                  <img src={createPhotoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Camera size={28} className="text-white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full" style={{ backgroundColor: "rgba(21,77,140,0.72)" }}>
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Click to add profile photo (optional)</p>
              <input
                ref={createPhotoInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > MAX_UPLOAD_BYTES) { toast.error("File too large. Max 5MB."); return; }
                  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) { toast.error("Invalid file type."); return; }
                  setCreatePhotoFile(file);
                  setCreatePhotoPreview(URL.createObjectURL(file));
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-slate-600">Full Name *</Label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Email *</Label>
                <Input 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Password *</Label>
                <Input 
                  type="password" 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Role</Label>
                <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                  <SelectTrigger className="mt-1 rounded-xl h-10" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>{ROLES.map(r => (<SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Phone</Label>
                <Input 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Department</Label>
                <Input 
                  value={form.department} 
                  onChange={e => setForm({ ...form, department: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Designation</Label>
                <Input 
                  value={form.designation} 
                  onChange={e => setForm({ ...form, designation: e.target.value })} 
                  className="mt-1 rounded-xl h-10"
                  style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  onFocus={(e) => e.target.style.borderColor = PRIMARY_COLOR}
                  onBlur={(e) => e.target.style.borderColor = `${PRIMARY_COLOR}30`}
                />
              </div>
              {managers.length > 0 && (
                <div className="col-span-2">
                  <Label className="text-xs text-slate-600">Assign Manager</Label>
                  <Select value={form.manager_id} onValueChange={v => setForm({ ...form, manager_id: v })}>
                    <SelectTrigger className="mt-1 rounded-xl h-10" style={{ borderColor: `${PRIMARY_COLOR}30` }}>
                      <SelectValue placeholder="Select manager…" />
                    </SelectTrigger>
                    <SelectContent>{managers.map(m => (<SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={createUser} 
              disabled={busy} 
              className="rounded-xl text-white"
              style={{ backgroundColor: PRIMARY_COLOR }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e3a6b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
            >
              {busy ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={selectedUser}
        managers={managers}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={updateUserInList}
        onDelete={canEdit ? (user) => { setUserToDelete(user); setDeleteConfirmOpen(true); } : undefined}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />Delete Employee
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              You are about to permanently delete{" "}
              <span className="font-semibold text-slate-900">{userToDelete?.name}</span>.
              This will remove their account, attendance records, and all associated data.
              <br /><br />
              <span className="font-semibold text-red-600">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl" onClick={() => { setDeleteConfirmOpen(false); setUserToDelete(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
              disabled={deleting}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting…" : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}