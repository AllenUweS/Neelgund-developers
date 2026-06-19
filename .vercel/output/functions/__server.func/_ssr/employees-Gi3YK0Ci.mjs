import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth, s as supabase } from "./router-C7DgCm7A.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, a as DialogContent, e as DialogHeader, b as DialogTitle, f as DialogFooter } from "./dialog-Dkkn6PWi.mjs";
import { a3 as UserPlus, n as Search, B as Briefcase, g as Building2, Y as Phone, a4 as Eye, a as LoaderCircle, p as Camera, U as User, _ as Mail, $ as Calendar } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const ROLES = ["employee", "manager", "hr", "admin", "super_admin", "transport"];
const ROLE_ORDER = ["super_admin", "admin", "manager", "hr", "employee", "transport"];
const ROLE_LABEL = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  hr: "HR",
  employee: "Employee",
  transport: "Transport"
};
const FILTERS = [{
  label: "All",
  roles: null
}, {
  label: "Admins",
  roles: ["admin", "super_admin"]
}, {
  label: "Managers",
  roles: ["manager"]
}, {
  label: "HR",
  roles: ["hr"]
}, {
  label: "Employees",
  roles: ["employee"]
}, {
  label: "Transport",
  roles: ["transport"]
}];
const PRIMARY_COLOR = "#154D8C";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
function sanitizeFileName(name) {
  return name.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "upload.bin";
}
async function uploadAvatarToStorage(file, userId) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large. Max allowed size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`);
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WEBP or GIF image.");
  }
  const safeName = sanitizeFileName(file.name);
  const objectPath = `${userId}/${Date.now()}-${safeName}`;
  const {
    error: uploadError
  } = await supabase.storage.from("avatars").upload(objectPath, file, {
    upsert: true,
    contentType: file.type
  });
  if (uploadError) throw new Error(uploadError.message);
  const {
    data
  } = supabase.storage.from("avatars").getPublicUrl(objectPath);
  return data.publicUrl;
}
async function saveAvatarUrl(userId, avatarUrl) {
  const {
    error
  } = await supabase.from("profiles").update({
    avatar_url: avatarUrl,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", userId);
  if (error) throw new Error(error.message);
}
function AvatarUploadButton({
  userId,
  currentUrl,
  name,
  size = "md",
  canEdit,
  onUpdated
}) {
  const inputRef = reactExports.useRef(null);
  const [uploading, setUploading] = reactExports.useState(false);
  const [preview, setPreview] = reactExports.useState(null);
  const dim = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";
  const cameraSize = size === "lg" ? 16 : 12;
  const displayUrl = preview ?? currentUrl;
  const handleFileChange = async (e) => {
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
    } catch (err) {
      setPreview(null);
      toast.error(err?.message ?? "Failed to upload photo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0 group", style: {
    width: size === "sm" ? 40 : size === "lg" ? 80 : 56
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${dim} rounded-full flex items-center justify-center font-semibold text-white shadow-md overflow-hidden select-none`, style: {
      backgroundColor: PRIMARY_COLOR
    }, children: displayUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: displayUrl, alt: name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name?.[0]?.toUpperCase() ?? "?" }) }),
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: uploading, onClick: () => inputRef.current?.click(), className: "absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200", style: {
        backgroundColor: "rgba(21,77,140,0.72)"
      }, title: "Change photo", children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: cameraSize, className: "text-white animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: cameraSize, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: ACCEPTED_IMAGE_TYPES.join(","), className: "hidden", onChange: handleFileChange })
    ] })
  ] });
}
function ViewUserDialog({
  user,
  open,
  onClose
}) {
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const {
    role: myRole
  } = useAuth();
  const canEdit = ["hr", "admin", "super_admin"].includes(myRole ?? "");
  reactExports.useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar_url ?? null);
    }
  }, [user]);
  const updateAvatar = (newUrl) => {
    setAvatarUrl(newUrl);
    if (user) user.avatar_url = newUrl;
  };
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { style: {
      color: PRIMARY_COLOR
    }, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }),
      "User Details"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 pb-4 border-b", style: {
        borderColor: `${PRIMARY_COLOR}20`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploadButton, { userId: user.id, currentUrl: avatarUrl, name: user.name ?? "", size: "lg", canEdit, onUpdated: updateAvatar }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium text-white", style: {
            backgroundColor: PRIMARY_COLOR
          }, children: user.role?.replace("_", " ") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              "Email"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700 break-all", children: user.email })
          ] }),
          user.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              "Phone"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: user.phone })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          user.designation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              "Designation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: user.designation })
          ] }),
          user.department && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              "Department"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: user.department })
          ] })
        ] }),
        user.joining_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3", style: {
              color: PRIMARY_COLOR
            } }),
            "Joining Date"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: new Date(user.joining_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] }),
        user.profile_notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3", style: {
              color: PRIMARY_COLOR
            } }),
            "Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-700", children: user.profile_notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 text-center text-xs text-muted-foreground border-t", style: {
        borderColor: `${PRIMARY_COLOR}20`
      }, children: user.created_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Joined: ",
        new Date(user.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, className: "rounded-xl text-white", style: {
      backgroundColor: PRIMARY_COLOR
    }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#0e3a6b", onMouseLeave: (e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR, children: "Close" }) })
  ] }) });
}
function HRManagementPage() {
  const {
    role: myRole
  } = useAuth();
  const canAccess = ["hr", "admin", "super_admin"].includes(myRole ?? "");
  const canCreate = canAccess;
  const canEdit = canAccess;
  const [list, setList] = reactExports.useState([]);
  const [managers, setManagers] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [activeRole, setActiveRole] = reactExports.useState("All");
  const [loading, setLoading] = reactExports.useState(false);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [viewOpen, setViewOpen] = reactExports.useState(false);
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    phone: "",
    department: "",
    designation: "",
    manager_id: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  const updateAvatarInList = (userId, newUrl) => setList((prev) => prev.map((e) => e.id === userId ? {
    ...e,
    avatar_url: newUrl
  } : e));
  const roleRank = {
    super_admin: 0,
    admin: 1,
    manager: 2,
    hr: 3,
    employee: 4,
    transport: 5
  };
  const filtered = reactExports.useMemo(() => {
    let result = list;
    if (q) {
      result = result.filter((e) => [e.name, e.email, e.designation, e.department].some((v) => v?.toLowerCase().includes(q.toLowerCase())));
    }
    if (activeRole !== "All") {
      const roles = FILTERS.find((f) => f.label === activeRole)?.roles;
      if (roles) result = result.filter((e) => roles.includes(e.role));
    }
    return [...result].sort((a, b) => {
      const rank = (roleRank[a.role] ?? 99) - (roleRank[b.role] ?? 99);
      return rank || a.name.localeCompare(b.name);
    });
  }, [list, q, activeRole]);
  const load = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("profiles").select("*").order("name");
    if (error) toast.error(error.message);
    setList(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
    supabase.from("profiles").select("id, name, email").eq("role", "manager").then(({
      data
    }) => setManagers(data ?? []));
  }, []);
  const createUser = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Name, email and password required");
    setBusy(true);
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    const res = await fetch(`${"https://kotbcwrvgekmyzovejqv.supabase.co"}/functions/v1/admin-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`
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
        managerId: form.manager_id || null
      })
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      toast.error(json.error ?? "Failed to create");
      return;
    }
    toast.success("User created");
    setCreateOpen(false);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "employee",
      phone: "",
      department: "",
      designation: "",
      manager_id: ""
    });
    load();
  };
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setViewOpen(true);
  };
  if (!canAccess) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-muted-foreground", children: "You do not have permission to view HR Management." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "HR Management", subtitle: `${list.length} users`, action: canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-xl gap-2 text-white", style: {
      backgroundColor: PRIMARY_COLOR
    }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#0e3a6b", onMouseLeave: (e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR, onClick: () => setCreateOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
      "Add User"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: FILTERS.map((filter) => {
      const count = filter.roles ? list.filter((e) => filter.roles?.includes(e.role)).length : list.length;
      const active = activeRole === filter.label;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveRole(filter.label), className: `rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition duration-200 ${active ? "text-white shadow-lg" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`, style: active ? {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR
      } : {}, children: [
        filter.label,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`, style: !active ? {
          backgroundColor: `${PRIMARY_COLOR}10`,
          color: PRIMARY_COLOR
        } : {}, children: count })
      ] }, filter.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4 max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5", style: {
        color: PRIMARY_COLOR
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search name, email, etc…", className: "pl-8 rounded-xl h-9 text-sm", style: {
        borderColor: `${PRIMARY_COLOR}30`
      }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: ROLE_ORDER.map((roleKey) => {
      const group = filtered.filter((e) => e.role === roleKey);
      if (group.length === 0) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-hidden rounded-3xl border p-4 shadow-sm", style: {
        borderColor: `${PRIMARY_COLOR}20`,
        backgroundColor: `${PRIMARY_COLOR}05`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.24em]", style: {
              color: PRIMARY_COLOR
            }, children: ROLE_LABEL[roleKey] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-slate-900", children: [
              group.length,
              " ",
              group.length === 1 ? "member" : "members"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] shadow-sm", style: {
            backgroundColor: `${PRIMARY_COLOR}10`,
            borderColor: `${PRIMARY_COLOR}20`,
            color: PRIMARY_COLOR
          }, children: ROLE_LABEL[roleKey] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: group.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, whileHover: {
          y: -3
        }, whileTap: {
          scale: 0.995
        }, transition: {
          delay: i * 0.02,
          duration: 0.2
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { onClick: () => handleUserClick(e), className: "cursor-pointer p-4 rounded-3xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg group", style: {
          borderColor: `${PRIMARY_COLOR}20`
        }, onMouseEnter: (e2) => e2.currentTarget.style.borderColor = PRIMARY_COLOR, onMouseLeave: (e2) => e2.currentTarget.style.borderColor = `${PRIMARY_COLOR}20`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploadButton, { userId: e.id, currentUrl: e.avatar_url, name: e.name ?? "", size: "sm", canEdit, onUpdated: (url) => updateAvatarInList(e.id, url) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-slate-900", children: e.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white", style: {
                backgroundColor: PRIMARY_COLOR
              }, children: e.role?.replace("_", " ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate mt-0.5", children: e.email }),
            e.designation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              e.designation
            ] }),
            e.department && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              e.department
            ] }),
            e.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3", style: {
                color: PRIMARY_COLOR
              } }),
              e.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-full flex items-center justify-center", style: {
            backgroundColor: `${PRIMARY_COLOR}10`,
            color: PRIMARY_COLOR
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }) }) })
        ] }) }) }, e.id)) })
      ] }, roleKey);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
        color: PRIMARY_COLOR
      }, children: "Add User" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[65vh] overflow-y-auto pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: form.password, onChange: (e) => setForm({
            ...form,
            password: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.role, onValueChange: (v) => setForm({
            ...form,
            role: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1 rounded-xl h-10", style: {
              borderColor: `${PRIMARY_COLOR}30`
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, className: "capitalize", children: r.replace("_", " ") }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.department, onChange: (e) => setForm({
            ...form,
            department: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Designation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.designation, onChange: (e) => setForm({
            ...form,
            designation: e.target.value
          }), className: "mt-1 rounded-xl h-10", style: {
            borderColor: `${PRIMARY_COLOR}30`
          }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
        ] }),
        managers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Assign Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.manager_id, onValueChange: (v) => setForm({
            ...form,
            manager_id: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1 rounded-xl h-10", style: {
              borderColor: `${PRIMARY_COLOR}30`
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select manager…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: managers.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m.id, children: m.name || m.email }, m.id)) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCreateOpen(false), className: "rounded-xl", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: createUser, disabled: busy, className: "rounded-xl text-white", style: {
          backgroundColor: PRIMARY_COLOR
        }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#0e3a6b", onMouseLeave: (e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR, children: busy ? "Creating…" : "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ViewUserDialog, { user: selectedUser, open: viewOpen, onClose: () => setViewOpen(false) })
  ] });
}
export {
  HRManagementPage as component
};
