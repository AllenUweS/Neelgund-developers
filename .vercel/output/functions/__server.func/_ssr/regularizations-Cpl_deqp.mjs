import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, s as supabase, t as toast } from "./router-kA0jnLqi.mjs";
import { P as PageHeader } from "./PageHeader-D_JcINPd.mjs";
import { C as Card } from "./card-D4It2k98.mjs";
import { B as Button } from "./button-BS0Rn7Xn.mjs";
import { I as Input } from "./input-DOZ_xDPt.mjs";
import { B as Badge } from "./badge-BfJxT4UD.mjs";
import { F as FileText } from "./file-text-B3PMezU-.mjs";
import { C as CircleAlert } from "./circle-alert-CAKHZepT.mjs";
import { C as CircleCheck } from "./circle-check-D7sKw66h.mjs";
import { C as CircleX } from "./circle-x-q7SEwnGf.mjs";
import { m as motion } from "./proxy-CqksTbZr.mjs";
import { S as Search } from "./search-DqizMWow.mjs";
import { F as Funnel } from "./funnel-Cc34wRpS.mjs";
import { A as AnimatePresence } from "./index-gOQvo6bR.mjs";
import { C as Clock } from "./clock-G-u5aefp.mjs";
import { U as User } from "./user-CJxkp5xx.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./utils-BH6shBk-.mjs";
import "./index-BNcWPUAp.mjs";
import "./createLucideIcon-Bp8knoDP.mjs";
function fmtTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function RegularizationsPage() {
  const {
    user,
    role
  } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  const [loading, setLoading] = reactExports.useState(true);
  const [data, setData] = reactExports.useState([]);
  const [profileMap, setProfileMap] = reactExports.useState({});
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from("attendance_regularizations").select("*").order("created_at", {
      ascending: false
    });
    if (!isElevated) {
      query = query.eq("employee_id", user.id);
    }
    const {
      data: regs,
      error
    } = await query;
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setData(regs || []);
    const empIds = [...new Set((regs || []).map((r) => r.employee_id))];
    if (empIds.length > 0) {
      const {
        data: profs
      } = await supabase.from("profiles").select("id, name, email").in("id", empIds);
      const map = {};
      (profs || []).forEach((p) => map[p.id] = p);
      setProfileMap(map);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    loadData();
  }, [user, isElevated]);
  const resolveReg = async (id, status) => {
    const {
      error
    } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Request ${status} successfully`);
    setData((prev) => prev.map((r) => r.id === id ? {
      ...r,
      status,
      resolved_at: (/* @__PURE__ */ new Date()).toISOString()
    } : r));
  };
  const filtered = reactExports.useMemo(() => {
    return data.filter((r) => {
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const empName = (profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "").toLowerCase();
      const matchSearch = search === "" || empName.includes(search.toLowerCase()) || (r.reason || "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [data, statusFilter, search, profileMap]);
  const total = data.length;
  const pending = data.filter((r) => r.status === "pending").length;
  const approved = data.filter((r) => r.status === "approved").length;
  const rejected = data.filter((r) => r.status === "rejected").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Regularizations History", subtitle: "Track, filter, and manage all attendance regularization requests." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [{
      label: "Total Requests",
      value: total,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50"
    }, {
      label: "Pending",
      value: pending,
      icon: CircleAlert,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }, {
      label: "Approved",
      value: approved,
      icon: CircleCheck,
      color: "text-green-600",
      bg: "bg-green-50"
    }, {
      label: "Rejected",
      value: rejected,
      icon: CircleX,
      color: "text-red-600",
      bg: "bg-red-50"
    }].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.05
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: `h-6 w-6 ${s.color}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium", children: s.label })
      ] })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-2 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name or reason...", className: "pl-9 bg-transparent border-0 focus-visible:ring-0 shadow-none h-10" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px sm:h-auto sm:w-px bg-gray-100 mx-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar", children: ["all", "pending", "approved", "rejected"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatusFilter(s), className: `px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${statusFilter === s ? "bg-[#154D8C] text-white" : "text-gray-500 hover:bg-gray-100"}`, children: s }, s)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground animate-pulse", children: "Loading regularizations..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 rounded-2xl border-dashed flex flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-8 w-8 text-gray-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "No requests found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Try adjusting your search or filters." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: filtered.map((r, i) => {
      const empName = profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "Unknown";
      const isPending = r.status === "pending";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layout: true, initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, exit: {
        opacity: 0,
        scale: 0.95
      }, transition: {
        delay: i * 0.03,
        duration: 0.2
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `overflow-hidden rounded-2xl border ${isPending ? "border-amber-200" : "border-gray-100"} transition-all hover:shadow-md h-full flex flex-col`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 border-b flex justify-between items-center ${isPending ? "bg-amber-50/50" : "bg-gray-50/50"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs font-bold text-gray-700", children: empName.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm leading-tight text-gray-900", children: empName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-gray-500", children: fmtDate(r.date) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `capitalize ${r.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : r.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`, children: r.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-2.5 rounded-xl border border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5", children: "Check In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm flex items-center gap-1.5 text-[#154D8C]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                fmtTime(r.requested_check_in_time)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-2.5 rounded-xl border border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5", children: "Check Out" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm flex items-center gap-1.5 text-[#154D8C]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                fmtTime(r.requested_check_out_time)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1", children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-3", children: [
              '"',
              r.reason || "No reason provided.",
              '"'
            ] })
          ] }),
          isElevated && isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-5 pt-4 border-t border-dashed border-gray-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => resolveReg(r.id, "rejected"), className: "flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-2" }),
              " Reject"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => resolveReg(r.id, "approved"), className: "flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white h-9", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-2" }),
              " Approve"
            ] })
          ] }),
          !isPending && r.resolved_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3" }),
            "Resolved on ",
            fmtDate(r.resolved_at)
          ] })
        ] })
      ] }) }, r.id);
    }) }) }) })
  ] });
}
export {
  RegularizationsPage as component
};
