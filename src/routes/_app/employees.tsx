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
import { Search, UserPlus, Phone, Briefcase, Building2, Camera, Loader2, Eye, Calendar, Mail, User, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/employees")({
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

// Consistent color for all roles - #154D8C
const PRIMARY_COLOR = "#154D8C";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function sanitizeFileName(name: string): string {
  return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "upload.bin";
}

async function uploadAvatarToStorage(file: File, userId: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large. Max allowed size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`);
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WEBP or GIF image.");
  }
  const safeName = sanitizeFileName(file.name);
  const objectPath = `${userId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(objectPath, file, { upsert: true, contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from("avatars").getPublicUrl(objectPath);
  return data.publicUrl;
}

async function saveAvatarUrl(userId: string, avatarUrl: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
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
}

function AvatarUploadButton({ userId, currentUrl, name, size = "md", canEdit, onUpdated }: AvatarUploadButtonProps) {
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
      const publicUrl = await uploadAvatarToStorage(file, userId);
      await saveAvatarUrl(userId, publicUrl);
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

  return (
    <div className="relative shrink-0 group" style={{ width: size === "sm" ? 40 : size === "lg" ? 80 : 56 }}>
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
            onClick={() => inputRef.current?.click()}
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

// ─── ViewUserDialog (View Only) ───────────────────────────────────────────────

interface ViewUserDialogProps {
  user: any;
  open: boolean;
  onClose: () => void;
  onUpdateUser?: (id: string, updates: any) => void;
}

function ViewUserDialog({ user, open, onClose, onUpdateUser }: ViewUserDialogProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [updating, setUpdating] = useState(false);
  const { role: myRole } = useAuth();
  const canEdit = ["hr", "admin", "super_admin"].includes(myRole ?? "");

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url ?? null);
      setIsActive(user.is_active ?? true);
    }
  }, [user]);

  const updateAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
    if (user) user.avatar_url = newUrl;
    if (onUpdateUser) onUpdateUser(user.id, { avatar_url: newUrl });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: PRIMARY_COLOR }} className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 pb-4 border-b" style={{ borderColor: `${PRIMARY_COLOR}20` }}>
            <AvatarUploadButton
              userId={user.id}
              currentUrl={avatarUrl}
              name={user.name ?? ""}
              size="lg"
              canEdit={canEdit}
              onUpdated={updateAvatar}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span
                  className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  {user.role?.replace("_", " ")}
                </span>
                {!isActive && (
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Mail className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                  Email
                </div>
                <div className="text-sm font-medium text-slate-700 break-all">{user.email}</div>
              </div>

              {user.phone && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Phone className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                    Phone
                  </div>
                  <div className="text-sm font-medium text-slate-700">{user.phone}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {user.designation && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Briefcase className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                    Designation
                  </div>
                  <div className="text-sm font-medium text-slate-700">{user.designation}</div>
                </div>
              )}

              {user.department && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Building2 className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                    Department
                  </div>
                  <div className="text-sm font-medium text-slate-700">{user.department}</div>
                </div>
              )}
            </div>

            {user.joining_date && (
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                  Joining Date
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {new Date(user.joining_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            )}

            {user.profile_notes && (
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <User className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />
                  Notes
                </div>
                <div className="text-sm text-slate-700">{user.profile_notes}</div>
              </div>
            )}

          </div>

          {/* Created/Updated Info */}
          <div className="pt-3 text-center text-xs text-muted-foreground border-t" style={{ borderColor: `${PRIMARY_COLOR}20` }}>
            {user.created_at && (
              <div>Joined: {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={onClose} className="rounded-xl text-white" style={{ backgroundColor: PRIMARY_COLOR }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0e3a6b"} onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}>
            Close
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
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee", phone: "", department: "", designation: "", manager_id: "" });
  const [busy, setBusy] = useState(false);

  const updateAvatarInList = (userId: string, newUrl: string) =>
    setList(prev => prev.map(e => e.id === userId ? { ...e, avatar_url: newUrl } : e));

  const updateUserInList = (userId: string, updates: any) =>
    setList(prev => prev.map(e => e.id === userId ? { ...e, ...updates } : e));

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
    setBusy(false);
    if (!res.ok) { toast.error(json.error ?? "Failed to create"); return; }
    toast.success("User created");
    setCreateOpen(false);
    setForm({ name: "", email: "", password: "", role: "employee", phone: "", department: "", designation: "", manager_id: "" });
    load();
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setViewOpen(true);
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
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition duration-200 ${active
                  ? "text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              style={active ? { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR } : {}}
            >
              {filter.label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${active
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
                      onClick={() => handleUserClick(e)}
                      className="cursor-pointer p-4 rounded-3xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
                      style={{ borderColor: `${PRIMARY_COLOR}20` }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = PRIMARY_COLOR}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = `${PRIMARY_COLOR}20`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar with upload */}
                        <AvatarUploadButton
                          userId={e.id}
                          currentUrl={e.avatar_url}
                          name={e.name ?? ""}
                          size="sm"
                          canEdit={canEdit}
                          onUpdated={url => updateAvatarInList(e.id, url)}
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
                            {e.is_active === false && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{e.email}</div>
                          {e.designation && <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Briefcase className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.designation}</div>}
                          {e.department && <div className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.department}</div>}
                          {e.phone && <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" style={{ color: PRIMARY_COLOR }} />{e.phone}</div>}
                        </div>

                        {/* View Icon */}
                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR }}>
                            <Eye className="h-3 w-3" />
                          </div>
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
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader><DialogTitle style={{ color: PRIMARY_COLOR }}>Add User</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
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
                  <SelectTrigger
                    className="mt-1 rounded-xl h-10"
                    style={{ borderColor: `${PRIMARY_COLOR}30` }}
                  >
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
                    <SelectTrigger
                      className="mt-1 rounded-xl h-10"
                      style={{ borderColor: `${PRIMARY_COLOR}30` }}
                    >
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

      {/* View User Dialog */}
      <ViewUserDialog
        user={selectedUser}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onUpdateUser={updateUserInList}
      />
    </>
  );
}