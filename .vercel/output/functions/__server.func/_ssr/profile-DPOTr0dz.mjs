import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth, s as supabase } from "./router-DHg9ZSsH.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { a as LoaderCircle, o as Camera } from "../_libs/lucide-react.mjs";
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
function ProfilePage() {
  const {
    user,
    profile: p,
    role
  } = useAuth();
  const [form, setForm] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const photoUrl = p?.profile_photo_url ?? p?.avatar_url ?? null;
  if (p && !form) setForm({
    name: p.name ?? "",
    phone: p.phone ?? "",
    designation: p.designation ?? "",
    department: p.department ?? "",
    profile_notes: p.profile_notes ?? ""
  });
  const save = async () => {
    if (!user || !form) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("profiles").update({
      name: form.name,
      phone: form.phone,
      designation: form.designation,
      department: form.department,
      profile_notes: form.profile_notes,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("File too large. Max 5MB.");
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return toast.error("Invalid file type.");
    setUploading(true);
    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `profile-photos/${user.id}-${Date.now()}.${ext}`;
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
      const {
        error: updateError
      } = await supabase.from("profiles").update({
        profile_photo_url: data.publicUrl,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", user.id);
      if (updateError) throw new Error(updateError.message);
      toast.success("Profile photo updated! Please refresh to see changes everywhere.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };
  if (!form) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground p-6", children: "Loading..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Your Profile", subtitle: "Update your personal information." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-2xl max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mb-6 pb-6 border-b border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#154D8C] flex items-center justify-center text-white text-2xl font-bold shadow-md overflow-hidden", children: photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photoUrl, alt: "Profile", className: "h-full w-full object-cover" }) : p?.name?.[0]?.toUpperCase() ?? "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "absolute inset-0 rounded-full bg-[#154D8C]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-white animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-6 h-6 text-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", className: "hidden", accept: "image/jpeg,image/png,image/webp,image/gif", onChange: handlePhotoUpload, disabled: uploading })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg text-gray-900", children: p?.name || "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: p?.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 mt-1 font-medium", children: "Hover photo to change" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), className: "mt-1 rounded-xl h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), className: "mt-1 rounded-xl h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Designation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.designation, onChange: (e) => setForm({
            ...form,
            designation: e.target.value
          }), className: "mt-1 rounded-xl h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.department, onChange: (e) => setForm({
            ...form,
            department: e.target.value
          }), className: "mt-1 rounded-xl h-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: p?.email ?? "", disabled: true, className: "mt-1 rounded-xl h-10 opacity-60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: role ?? "", disabled: true, className: "mt-1 rounded-xl h-10 opacity-60 capitalize" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Joining Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: p?.joining_date ?? "", disabled: true, className: "mt-1 rounded-xl h-10 opacity-60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.profile_notes, onChange: (e) => setForm({
            ...form,
            profile_notes: e.target.value
          }), className: "mt-1 rounded-xl resize-none", rows: 3 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, className: "mt-5 rounded-xl", children: busy ? "Saving…" : "Save changes" })
    ] })
  ] });
}
export {
  ProfilePage as component
};
