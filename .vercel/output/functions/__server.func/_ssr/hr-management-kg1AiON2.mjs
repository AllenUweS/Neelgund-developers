import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth, s as supabase } from "./router-DHg9ZSsH.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { B as Button, b as buttonVariants } from "./button-DA2gxxPy.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-DAqyjhfK.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { $ as UserPlus, m as Search, B as Briefcase, W as Building2, K as Phone, o as Camera, a0 as Trash2, a as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
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
function resolvePhotoUrl(profile) {
  return profile?.profile_photo_url ?? profile?.avatar_url ?? null;
}
async function uploadProfilePhoto(file, userId) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large. Max allowed size is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`);
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WEBP or GIF image.");
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `profile-photos/${userId}-${Date.now()}.${ext}`;
  const {
    error: uploadError
  } = await supabase.storage.from("documents").upload(path, file, {
    upsert: true,
    contentType: file.type
  });
  if (uploadError) throw new Error(uploadError.message);
  const {
    data
  } = supabase.storage.from("documents").getPublicUrl(path);
  return data.publicUrl;
}
async function saveProfilePhotoUrl(userId, photoUrl) {
  const {
    error
  } = await supabase.from("profiles").update({
    profile_photo_url: photoUrl,
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
  onUpdated,
  onClick
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
      const publicUrl = await uploadProfilePhoto(file, userId);
      await saveProfilePhotoUrl(userId, publicUrl);
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
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0 group", style: {
    width: size === "sm" ? 40 : size === "lg" ? 80 : 56
  }, onClick: handleClick, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${dim} rounded-full flex items-center justify-center font-semibold text-white shadow-md overflow-hidden select-none`, style: {
      backgroundColor: PRIMARY_COLOR
    }, children: displayUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: displayUrl, alt: name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name?.[0]?.toUpperCase() ?? "?" }) }),
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: uploading, onClick: (e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }, className: "absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200", style: {
        backgroundColor: "rgba(21,77,140,0.72)"
      }, title: "Change photo", children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: cameraSize, className: "text-white animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: cameraSize, className: "text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: ACCEPTED_IMAGE_TYPES.join(","), className: "hidden", onChange: handleFileChange })
    ] })
  ] });
}
function EditUserDialog({
  user,
  managers,
  open,
  onClose,
  onSaved,
  onDelete
}) {
  const {
    role: myRole
  } = useAuth();
  const [form, setForm] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  const [photoUrl, setPhotoUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
        joining_date: user.joining_date ?? ""
      });
      setPhotoUrl(resolvePhotoUrl(user));
    }
  }, [user]);
  const save = async () => {
    if (!form.name?.trim()) return toast.error("Name is required");
    if (!form.email?.trim()) return toast.error("Email is required");
    setBusy(true);
    try {
      const patch = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        phone: form.phone?.trim() || null,
        department: form.department?.trim() || null,
        designation: form.designation?.trim() || null,
        manager_id: form.manager_id || null,
        joining_date: form.joining_date || null,
        profile_notes: form.profile_notes?.trim() || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const {
        data: updatedProfile,
        error: profileErr
      } = await supabase.from("profiles").update(patch).eq("id", user.id).select().single();
      if (profileErr) throw new Error(profileErr.message);
      if (form.password?.trim()) {
        if (form.password.trim().length < 8) throw new Error("Password must be at least 8 characters");
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
            action: "reset_password",
            id: user.id,
            password: form.password.trim()
          })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Profile saved but password update failed");
      }
      toast.success("User updated successfully");
      onSaved({
        ...updatedProfile,
        profile_photo_url: photoUrl
      });
      onClose();
    } catch (err) {
      toast.error(err?.message ?? "Failed to update user");
    } finally {
      setBusy(false);
    }
  };
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
      color: PRIMARY_COLOR
    }, children: "Edit User" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 py-2 border-b", style: {
      borderColor: `${PRIMARY_COLOR}20`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploadButton, { userId: user.id, currentUrl: photoUrl, name: user.name ?? "", size: "lg", canEdit: true, onUpdated: (url) => setPhotoUrl(url) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-800", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 font-medium", style: {
          color: PRIMARY_COLOR
        }, children: "Hover the photo to change it" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[55vh] overflow-y-auto pr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Full Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "mt-1 rounded-xl h-10", style: {
          borderColor: `${PRIMARY_COLOR}30`
        }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }), className: "mt-1 rounded-xl h-10", style: {
          borderColor: `${PRIMARY_COLOR}30`
        }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Password (leave blank to keep current)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: form.password, onChange: (e) => setForm({
          ...form,
          password: e.target.value
        }), placeholder: "Enter new password to change", className: "mt-1 rounded-xl h-10", style: {
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Joining Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.joining_date, onChange: (e) => setForm({
          ...form,
          joining_date: e.target.value
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
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.profile_notes, onChange: (e) => setForm({
          ...form,
          profile_notes: e.target.value
        }), className: "mt-1 rounded-xl h-10", style: {
          borderColor: `${PRIMARY_COLOR}30`
        }, onFocus: (e) => e.target.style.borderColor = PRIMARY_COLOR, onBlur: (e) => e.target.style.borderColor = `${PRIMARY_COLOR}30` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 flex-wrap", children: [
      onDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
        onClose();
        onDelete(user);
      }, className: "rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400 mr-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
        "Delete Employee"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, className: "rounded-xl", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, className: "rounded-xl text-white", style: {
        backgroundColor: PRIMARY_COLOR
      }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#0e3a6b", onMouseLeave: (e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR, children: busy ? "Saving…" : "Save Changes" })
    ] })
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
  const [editOpen, setEditOpen] = reactExports.useState(false);
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
  const [createPhotoFile, setCreatePhotoFile] = reactExports.useState(null);
  const [createPhotoPreview, setCreatePhotoPreview] = reactExports.useState(null);
  const createPhotoInputRef = reactExports.useRef(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = reactExports.useState(false);
  const [userToDelete, setUserToDelete] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const updateUserInList = (updated) => setList((prev) => prev.map((e) => e.id === updated.id ? {
    ...e,
    ...updated
  } : e));
  const updatePhotoInList = (userId, newUrl) => setList((prev) => prev.map((e) => e.id === userId ? {
    ...e,
    profile_photo_url: newUrl
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
    if (!res.ok) {
      setBusy(false);
      toast.error(json.error ?? "Failed to create");
      return;
    }
    if (createPhotoFile && json.id) {
      try {
        const publicUrl = await uploadProfilePhoto(createPhotoFile, json.id);
        await saveProfilePhotoUrl(json.id, publicUrl);
      } catch (err) {
        toast.warning("User created but photo upload failed: " + (err?.message ?? "Unknown error"));
      }
    }
    setBusy(false);
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
    setCreatePhotoFile(null);
    setCreatePhotoPreview(null);
    load();
  };
  const deleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
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
          action: "delete",
          id: userToDelete.id
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to delete");
      toast.success(`${userToDelete.name} has been deleted`);
      setList((prev) => prev.filter((e) => e.id !== userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      if (selectedUser?.id === userToDelete.id) {
        setEditOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      toast.error(err?.message ?? "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };
  const handleCardClick = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
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
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { onClick: () => handleCardClick(e), className: "cursor-pointer p-4 rounded-3xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg group", style: {
          borderColor: `${PRIMARY_COLOR}20`
        }, onMouseEnter: (e2) => e2.currentTarget.style.borderColor = PRIMARY_COLOR, onMouseLeave: (e2) => e2.currentTarget.style.borderColor = `${PRIMARY_COLOR}20`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploadButton, { userId: e.id, currentUrl: resolvePhotoUrl(e), name: e.name ?? "", size: "sm", canEdit, onUpdated: (url) => updatePhotoInList(e.id, url) }),
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
          ] })
        ] }) }) }, e.id)) })
      ] }, roleKey);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: (open) => {
      setCreateOpen(open);
      if (!open) {
        setCreatePhotoFile(null);
        setCreatePhotoPreview(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
        color: PRIMARY_COLOR
      }, children: "Add Employee" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-h-[65vh] overflow-y-auto pr-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 pb-3 border-b", style: {
          borderColor: `${PRIMARY_COLOR}20`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-20 rounded-full overflow-hidden cursor-pointer group shadow-md", style: {
            backgroundColor: PRIMARY_COLOR
          }, onClick: () => createPhotoInputRef.current?.click(), children: [
            createPhotoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: createPhotoPreview, alt: "Preview", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 28, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full", style: {
              backgroundColor: "rgba(21,77,140,0.72)"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 20, className: "text-white" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click to add profile photo (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: createPhotoInputRef, type: "file", accept: ACCEPTED_IMAGE_TYPES.join(","), className: "hidden", onChange: (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > MAX_UPLOAD_BYTES) {
              toast.error("File too large. Max 5MB.");
              return;
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
              toast.error("Invalid file type.");
              return;
            }
            setCreatePhotoFile(file);
            setCreatePhotoPreview(URL.createObjectURL(file));
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
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
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCreateOpen(false), className: "rounded-xl", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: createUser, disabled: busy, className: "rounded-xl text-white", style: {
          backgroundColor: PRIMARY_COLOR
        }, onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#0e3a6b", onMouseLeave: (e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR, children: busy ? "Creating…" : "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditUserDialog, { user: selectedUser, managers, open: editOpen, onClose: () => setEditOpen(false), onSaved: updateUserInList, onDelete: canEdit ? (user) => {
      setUserToDelete(user);
      setDeleteConfirmOpen(true);
    } : void 0 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteConfirmOpen, onOpenChange: setDeleteConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "rounded-2xl max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "text-red-600 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }),
          "Delete Employee"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-slate-600", children: [
          "You are about to permanently delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: userToDelete?.name }),
          ". This will remove their account, attendance records, and all associated data.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-red-600", children: "This action cannot be undone." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "rounded-xl", onClick: () => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: deleteUser, disabled: deleting, className: "rounded-xl bg-red-600 hover:bg-red-700 text-white", children: deleting ? "Deleting…" : "Yes, Delete" })
      ] })
    ] }) })
  ] });
}
export {
  HRManagementPage as component
};
