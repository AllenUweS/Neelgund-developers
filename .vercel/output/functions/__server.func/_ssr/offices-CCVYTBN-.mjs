import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./router-C7DgCm7A.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { D as Dialog, a as DialogContent, b as DialogTitle, c as DialogDescription } from "./dialog-Dkkn6PWi.mjs";
import { P as Plus, q as Compass, g as Building2, r as Pen, s as Check, e as Users, T as Trash2, t as MapPin, X } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function OfficesPage() {
  const [offices, setOffices] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editLat, setEditLat] = reactExports.useState("");
  const [editLon, setEditLon] = reactExports.useState("");
  const [editRadius, setEditRadius] = reactExports.useState("");
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newLat, setNewLat] = reactExports.useState("");
  const [newLon, setNewLon] = reactExports.useState("");
  const [newRadius, setNewRadius] = reactExports.useState("100");
  const [assigningOffice, setAssigningOffice] = reactExports.useState(null);
  const [profiles, setProfiles] = reactExports.useState([]);
  const [assignedProfileIds, setAssignedProfileIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loadingProfiles, setLoadingProfiles] = reactExports.useState(false);
  const loadOffices = async () => {
    setBusy(true);
    const {
      data,
      error
    } = await supabase.from("office_locations").select("*").order("name");
    setBusy(false);
    if (error) {
      toast.error("Failed to load offices");
    } else {
      setOffices(data || []);
      const defaultOffice = data?.find((o) => o.name.toLowerCase().includes("neelgund")) || data?.[0];
      if (defaultOffice) {
        supabase.from("profiles").update({
          office_id: defaultOffice.id
        }).is("office_id", null).then();
      }
    }
  };
  reactExports.useEffect(() => {
    loadOffices();
  }, []);
  const handleAdd = async () => {
    if (!newName || !newLat || !newLon || !newRadius) return toast.error("Please fill all fields");
    setBusy(true);
    const {
      error
    } = await supabase.from("office_locations").insert({
      name: newName,
      latitude: parseFloat(newLat),
      longitude: parseFloat(newLon),
      radius_meters: parseInt(newRadius, 10)
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office added successfully");
      setIsAdding(false);
      setNewName("");
      setNewLat("");
      setNewLon("");
      setNewRadius("100");
      loadOffices();
    }
  };
  const handleSaveEdit = async (id) => {
    if (!editName || !editLat || !editLon || !editRadius) return toast.error("Please fill all fields");
    setBusy(true);
    const {
      error
    } = await supabase.from("office_locations").update({
      name: editName,
      latitude: parseFloat(editLat),
      longitude: parseFloat(editLon),
      radius_meters: parseInt(editRadius, 10)
    }).eq("id", id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office updated successfully");
      setEditingId(null);
      loadOffices();
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("office_locations").delete().eq("id", id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office deleted successfully");
      loadOffices();
    }
  };
  const startEdit = (office) => {
    setEditingId(office.id);
    setEditName(office.name);
    setEditLat(office.latitude.toString());
    setEditLon(office.longitude.toString());
    setEditRadius(office.radius_meters.toString());
    setIsAdding(false);
  };
  const openAssignDialog = async (office) => {
    setAssigningOffice(office);
    setLoadingProfiles(true);
    const {
      data,
      error
    } = await supabase.from("profiles").select("id, name, email, office_id");
    if (error) {
      toast.error("Error loading profiles. Did you run the SQL migration?");
      setAssigningOffice(null);
    } else if (data) {
      setProfiles(data);
      const assigned = new Set(data.filter((p) => p.office_id === office.id).map((p) => p.id));
      setAssignedProfileIds(assigned);
    }
    setLoadingProfiles(false);
  };
  const toggleAssignment = async (profile) => {
    const isAssigned = assignedProfileIds.has(profile.id);
    const newOfficeId = isAssigned ? null : assigningOffice.id;
    setBusy(true);
    const {
      error
    } = await supabase.from("profiles").update({
      office_id: newOfficeId
    }).eq("id", profile.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      const newAssigned = new Set(assignedProfileIds);
      if (isAssigned) newAssigned.delete(profile.id);
      else newAssigned.add(profile.id);
      setAssignedProfileIds(newAssigned);
      setProfiles(profiles.map((p) => p.id === profile.id ? {
        ...p,
        office_id: newOfficeId
      } : p));
      toast.success(isAssigned ? `${profile.name} removed from office` : `${profile.name} assigned to office`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Office Locations", subtitle: "Manage geofencing areas for attendance tracking" }),
      !isAdding && !editingId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsAdding(true), className: "bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-5 transition-transform hover:scale-105 active:scale-95 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
        " Add New Office"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isAdding && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      height: 0,
      y: -20
    }, animate: {
      opacity: 1,
      height: "auto",
      y: 0
    }, exit: {
      opacity: 0,
      height: 0,
      y: -20
    }, className: "mb-8 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-2xl border border-blue-100 shadow-lg bg-gradient-to-br from-blue-50/50 to-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-8 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "w-64 h-64" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#154D8C] text-white p-2.5 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900", children: "Create New Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Define a new geofence for employee check-ins" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-wider", children: "Location Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "e.g. Headquarters", className: "w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-wider", children: "Geofence Radius" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: newRadius, onChange: (e) => setNewRadius(e.target.value), placeholder: "100", className: "w-full p-3 pr-16 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100", children: "meters" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-wider", children: "Latitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "any", value: newLat, onChange: (e) => setNewLat(e.target.value), placeholder: "12.9716", className: "w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm font-mono" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-wider", children: "Longitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "any", value: newLon, onChange: (e) => setNewLon(e.target.value), placeholder: "77.5946", className: "w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm font-mono" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 justify-end pt-2 border-t border-blue-100/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsAdding(false), className: "rounded-xl px-5 hover:bg-gray-100/80", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAdd, disabled: busy, className: "bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl px-6 shadow-md transition-all", children: "Save Location" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: offices.map((office) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, initial: {
      opacity: 0,
      scale: 0.95
    }, animate: {
      opacity: 1,
      scale: 1
    }, className: "h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "h-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-gray-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group relative", children: editingId === office.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col bg-amber-50/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 text-amber-700 font-semibold text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }),
        " Editing ",
        office.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1", children: "Office Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editName, onChange: (e) => setEditName(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1", children: "Radius (meters)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: editRadius, onChange: (e) => setEditRadius(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1", children: "Latitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "any", value: editLat, onChange: (e) => setEditLat(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1", children: "Longitude" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "any", value: editLon, onChange: (e) => setEditLon(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end mt-5 pt-4 border-t border-amber-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setEditingId(null), className: "rounded-lg text-xs bg-white hover:bg-gray-50", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => handleSaveEdit(office.id), disabled: busy, className: "rounded-lg text-xs bg-amber-500 text-white hover:bg-amber-600 border-none shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1" }),
          " Save"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-gradient-to-r from-[#154D8C] to-blue-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex-1 flex flex-col relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openAssignDialog(office), className: "p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm", title: "Assign Employees", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(office), className: "p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm", title: "Edit Office", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(office.id), className: "p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm", title: "Delete Office", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#154D8C] shadow-inner shrink-0 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 flex-1 pr-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-gray-900 leading-tight mb-1", children: office.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center px-2 py-0.5 rounded bg-green-50 border border-green-100 text-green-700 text-xs font-semibold", children: "Active Geofence" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-blue-500" }),
              " Coordinates"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm", children: [
              office.latitude.toFixed(4),
              ", ",
              office.longitude.toFixed(4)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "w-4 h-4 text-indigo-500" }),
              " Radius Coverage"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold text-[#154D8C]", children: [
              office.radius_meters,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-400", children: "meters" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-8 -right-8 w-32 h-32 bg-blue-50 rounded-full border border-blue-100/50 flex items-center justify-center opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full border border-blue-200/50" }) })
      ] })
    ] }) }) }, office.id)) }),
    offices.length === 0 && !isAdding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-gray-200 rounded-3xl shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-300 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "No Offices Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 max-w-sm mb-6", children: "You haven't defined any office locations for attendance geofencing yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setIsAdding(true), className: "bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-6 transition-transform hover:scale-105 active:scale-95", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
        " Add Your First Office"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!assigningOffice, onOpenChange: (open) => !open && setAssigningOffice(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-[#154D8C] to-blue-600 p-6 text-white shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-blue-200" }),
          "Assign Employees to ",
          assigningOffice?.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-100 mt-1", children: "Select employees who should be restricted to check in and out from this location. By default, unassigned employees fall back to the Neelgund office." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1 bg-gray-50", children: loadingProfiles ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#154D8C]" }) }) : profiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-gray-500", children: "No active employees found." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-gray-700 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-green-600" }),
            " Currently Assigned (",
            profiles.filter((p) => assignedProfileIds.has(p.id)).length,
            ")"
          ] }),
          profiles.filter((p) => assignedProfileIds.has(p.id)).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 bg-white p-3 rounded-xl border border-dashed", children: "No employees assigned to this office yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: profiles.filter((p) => assignedProfileIds.has(p.id)).map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl border transition-all bg-blue-50 border-blue-200 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-[#154D8C] text-white", children: profile.name?.charAt(0)?.toUpperCase() || "U" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate text-[#154D8C]", children: profile.name || "Unnamed User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 truncate", children: profile.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => toggleAssignment(profile), disabled: busy, className: "shrink-0 rounded-lg h-8 px-3 ml-2 text-xs font-semibold bg-[#154D8C] hover:bg-red-500 hover:text-white transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "group-hover:hidden flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1" }),
                " Assigned"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden group-hover:flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 mr-1" }),
                " Remove"
              ] })
            ] })
          ] }, profile.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-gray-700 mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-gray-400" }),
            " Other Employees (",
            profiles.filter((p) => !assignedProfileIds.has(p.id)).length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: profiles.filter((p) => !assignedProfileIds.has(p.id)).map((profile) => {
            const isAssignedToOther = profile.office_id != null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl border transition-all bg-white border-gray-200 hover:border-blue-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-gray-100 text-gray-600", children: profile.name?.charAt(0)?.toUpperCase() || "U" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate text-gray-900", children: profile.name || "Unnamed User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 truncate", children: profile.email }),
                  isAssignedToOther && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600 font-medium mt-0.5", children: "Currently assigned to another office" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleAssignment(profile), disabled: busy, className: "shrink-0 rounded-lg h-8 px-3 ml-2 text-xs font-semibold bg-white text-[#154D8C] hover:bg-blue-50 border-blue-200 hover:border-[#154D8C]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                " Assign"
              ] }) })
            ] }, profile.id);
          }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white border-t flex justify-end shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setAssigningOffice(null), className: "rounded-xl px-6", children: "Done" }) })
    ] }) })
  ] });
}
export {
  OfficesPage as component
};
