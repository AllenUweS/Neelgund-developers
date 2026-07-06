import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, s as supabase, t as toast } from "./router-kA0jnLqi.mjs";
import { C as Card } from "./card-D4It2k98.mjs";
import { B as Button } from "./button-BS0Rn7Xn.mjs";
import { B as Badge } from "./badge-BfJxT4UD.mjs";
import { P as PageHeader } from "./PageHeader-D_JcINPd.mjs";
import { D as Dialog, a as DialogContent, e as DialogHeader, b as DialogTitle, c as DialogDescription } from "./dialog-iwZRVXZk.mjs";
import { C as ChevronLeft } from "./chevron-left-DKEbyP5h.mjs";
import { C as ChevronRight } from "./chevron-right-CGO018xF.mjs";
import { L as LoaderCircle } from "./loader-circle-CYmj20TS.mjs";
import { L as LayoutGrid } from "./layout-grid-CI_n7N3T.mjs";
import { c as createLucideIcon } from "./createLucideIcon-Bp8knoDP.mjs";
import { m as motion } from "./proxy-CqksTbZr.mjs";
import { C as CircleAlert } from "./circle-alert-CAKHZepT.mjs";
import { C as CircleCheck } from "./circle-check-D7sKw66h.mjs";
import { M as MapPin } from "./map-pin-Cja6BU2D.mjs";
import { L as LogOut } from "./log-out-BajhjrRi.mjs";
import { U as Users } from "./users-g1jX10OK.mjs";
import { D as Download } from "./download-D3C2DxtS.mjs";
import { C as Clock } from "./clock-G-u5aefp.mjs";
import { C as CircleX } from "./circle-x-q7SEwnGf.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./utils-BH6shBk-.mjs";
import "./index-BNcWPUAp.mjs";
import "./Combination-Bz5I4c0I.mjs";
import "./x-DD9OPI7P.mjs";
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$1);
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function MonthlyView({ allowedProfiles }) {
  const [currentMonth, setCurrentMonth] = reactExports.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [attendanceData, setAttendanceData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const fetchMonthData = async () => {
    if (allowedProfiles.length === 0) return;
    setLoading(true);
    const start = new Date(currentMonth);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const formatLocal = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const startStr = formatLocal(start);
    const endStr = formatLocal(end);
    const empIds = allowedProfiles.map((p) => p.id);
    const { data } = await supabase.from("attendance").select("*").in("employee_id", empIds).gte("date", startStr).lte("date", endStr);
    setAttendanceData(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    fetchMonthData();
  }, [currentMonth, allowedProfiles]);
  const goBackMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const goForwardMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const attByEmp = attendanceData.reduce((acc, curr) => {
    if (!acc[curr.employee_id]) acc[curr.employee_id] = {};
    const day = parseInt(curr.date.split("-")[2], 10);
    acc[curr.employee_id][day] = curr;
    return acc;
  }, {});
  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-400";
      case "half_day":
        return "bg-amber-400";
      case "absent":
        return "bg-red-400";
      default:
        return "bg-gray-200";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-6 mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-800 flex items-center gap-2", children: "Monthly Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-9", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBackMonth, className: "w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 font-bold text-sm text-[#154D8C] min-w-[140px] text-center", children: monthLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goForwardMonth, className: "w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-gray-600" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-x-auto w-full", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-20 bg-white/60 flex items-center justify-center backdrop-blur-[1px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-[#154D8C] animate-spin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm text-left whitespace-nowrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-gray-500 bg-gray-50/80 border-b border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 sticky left-0 z-10 bg-gray-50/95 backdrop-blur-sm border-r border-gray-100 min-w-[180px]", children: "Employee" }),
          daysArray.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-2 py-3 text-center min-w-[36px] font-medium", children: d }, d)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { scope: "col", className: "px-4 py-3 text-center min-w-[80px] bg-gray-50/80 sticky right-0 shadow-[-4px_0_12px_rgba(0,0,0,0.02)] border-l border-gray-100", children: "Total P" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          allowedProfiles.map((p) => {
            const empAtt = attByEmp[p.id] || {};
            let totalPresent = 0;
            let totalHalf = 0;
            daysArray.forEach((d) => {
              if (empAtt[d]?.status === "present") totalPresent += 1;
              if (empAtt[d]?.status === "half_day") totalHalf += 1;
            });
            const totalEquivalent = totalPresent + totalHalf * 0.5;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-50 hover:bg-blue-50/30 transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 sticky left-0 z-10 bg-white group-hover:bg-blue-50/80 transition-colors border-r border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-gray-900 truncate w-[160px]", children: p.name || p.email }) }),
              daysArray.map((d) => {
                const status = empAtt[d]?.status;
                const dateStr = empAtt[d]?.date;
                const isWeekend = (() => {
                  const dt = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                  return dt.getDay() === 0;
                })();
                return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-2 py-2.5 text-center ${isWeekend && !status ? "bg-gray-50/50" : ""}`, title: dateStr ? `${dateStr}: ${status?.replace("_", " ")}` : "No Record", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: status ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2.5 h-2.5 rounded-full ${getStatusColor(status)} shadow-sm ring-2 ring-white` }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-gray-200" }) }) }, d);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-bold text-[#154D8C] sticky right-0 bg-white group-hover:bg-blue-50/80 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.02)] border-l border-gray-100", children: totalEquivalent })
            ] }, p.id);
          }),
          allowedProfiles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: daysArray.length + 2, className: "px-4 py-8 text-center text-gray-500", children: "No employees found for this view." }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" }),
        " Present"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" }),
        " Half Day"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" }),
        " Absent"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full bg-gray-200" }),
        " No Record"
      ] })
    ] })
  ] });
}
function fmt(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
function formatDurationSeconds(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
function formatDurationSecondsObj(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return {
    h: h.toString().padStart(2, "0"),
    m: m.toString().padStart(2, "0"),
    s: s.toString().padStart(2, "0")
  };
}
function TimePicker12({
  value,
  onChange
}) {
  const [h, m] = value.split(":");
  const hour24 = parseInt(h, 10);
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 || 12;
  const handleHour = (e) => {
    let newH = parseInt(e.target.value, 10);
    if (isPm && newH !== 12) newH += 12;
    if (!isPm && newH === 12) newH = 0;
    onChange(`${newH.toString().padStart(2, "0")}:${m}`);
  };
  const handleMin = (e) => {
    onChange(`${h}:${e.target.value}`);
  };
  const handleAmPm = (e) => {
    const pm = e.target.value === "PM";
    let newH = hour24;
    if (pm && !isPm) newH = hour24 % 12 + 12;
    if (!pm && isPm) newH = hour24 % 12;
    onChange(`${newH.toString().padStart(2, "0")}:${m}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center bg-white border border-gray-200 rounded-lg p-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: hour12, onChange: handleHour, className: "p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center", children: Array.from({
      length: 12
    }, (_, i) => i + 1).map((hr) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: hr, children: hr.toString().padStart(2, "0") }, hr)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-400", children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: m, onChange: handleMin, className: "p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center", children: ["00", "15", "30", "45"].map((min) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: min, children: min }, min)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: isPm ? "PM" : "AM", onChange: handleAmPm, className: "p-1.5 text-sm font-semibold bg-gray-100 rounded text-[#1E3A5F] outline-none cursor-pointer flex-1 appearance-none text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AM", children: "AM" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PM", children: "PM" })
    ] })
  ] });
}
function LiveTimer({
  startTime,
  isActive
}) {
  const [duration, setDuration] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!isActive || !startTime) return;
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now2 = (/* @__PURE__ */ new Date()).getTime();
      const diffSeconds2 = Math.floor((now2 - start) / 1e3);
      setDuration(diffSeconds2);
    }, 1e3);
    const now = (/* @__PURE__ */ new Date()).getTime();
    const diffSeconds = Math.floor((now - start) / 1e3);
    setDuration(diffSeconds);
    return () => clearInterval(interval);
  }, [startTime, isActive]);
  if (!isActive || !startTime) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-blue-700 bg-blue-50/80 px-2 py-1 rounded-md border border-blue-200 shadow-sm font-mono text-[11px] font-bold w-fit inline-flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-2 w-2 mr-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-green-500" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums tracking-wider", children: formatDurationSeconds(duration) })
  ] });
}
const statusColor = {
  present: "bg-green-100 text-green-700",
  half_day: "bg-amber-100 text-amber-700",
  absent: "bg-red-100 text-red-700"
};
function AttendancePage() {
  const {
    user,
    role,
    profile
  } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  const [today, setToday] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [teamToday, setTeamToday] = reactExports.useState([]);
  const [selectedTeamDate, setSelectedTeamDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [profileMap, setProfileMap] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  const [selectedAttendance, setSelectedAttendance] = reactExports.useState(null);
  const [showDetailDialog, setShowDetailDialog] = reactExports.useState(false);
  const [liveDuration, setLiveDuration] = reactExports.useState(0);
  const [myRegularizations, setMyRegularizations] = reactExports.useState([]);
  const [pendingRegularizations, setPendingRegularizations] = reactExports.useState([]);
  const [showApplyDialog, setShowApplyDialog] = reactExports.useState(false);
  const [applyAttendance, setApplyAttendance] = reactExports.useState(null);
  const [regReason, setRegReason] = reactExports.useState("");
  const [regCheckIn, setRegCheckIn] = reactExports.useState("09:00");
  const [regCheckOut, setRegCheckOut] = reactExports.useState("18:00");
  const [showReviewDialog, setShowReviewDialog] = reactExports.useState(false);
  const [reviewReg, setReviewReg] = reactExports.useState(null);
  const [allowedProfiles, setAllowedProfiles] = reactExports.useState([]);
  const [showManualDialog, setShowManualDialog] = reactExports.useState(false);
  const [manualEmpId, setManualEmpId] = reactExports.useState("");
  const [manualDate, setManualDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [manualCheckIn, setManualCheckIn] = reactExports.useState("09:00");
  const [manualCheckOut, setManualCheckOut] = reactExports.useState("18:00");
  const [manualStatus, setManualStatus] = reactExports.useState("present");
  reactExports.useEffect(() => {
    if (manualStatus === "absent") return;
    if (manualCheckIn && manualCheckOut) {
      const inDate = /* @__PURE__ */ new Date(`2000-01-01T${manualCheckIn}:00`);
      let outDate = /* @__PURE__ */ new Date(`2000-01-01T${manualCheckOut}:00`);
      if (outDate < inDate) {
        outDate = /* @__PURE__ */ new Date(`2000-01-02T${manualCheckOut}:00`);
      }
      const workedHours = (outDate.getTime() - inDate.getTime()) / 36e5;
      if (workedHours >= 8 && manualStatus !== "present") {
        setManualStatus("present");
      } else if (workedHours >= 4 && workedHours < 8 && manualStatus !== "half_day") {
        setManualStatus("half_day");
      } else if (workedHours < 4 && manualStatus !== "absent") {
        setManualStatus("absent");
      }
    }
  }, [manualCheckIn, manualCheckOut, manualStatus]);
  const [showExportDialog, setShowExportDialog] = reactExports.useState(false);
  const [exportType, setExportType] = reactExports.useState("standard");
  const [exportStartDate, setExportStartDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [exportEndDate, setExportEndDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [exportSelectedEmployees, setExportSelectedEmployees] = reactExports.useState([]);
  const [allOffices, setAllOffices] = reactExports.useState([]);
  const [currentDistance, setCurrentDistance] = reactExports.useState(null);
  const [assignedOffice, setAssignedOffice] = reactExports.useState(null);
  const [locationError, setLocationError] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("daily");
  const timerInterval = reactExports.useRef(null);
  const load = async () => {
    if (!user) return;
    const currentDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const {
      data: t
    } = await supabase.from("attendance").select("*").eq("employee_id", user.id).eq("date", currentDate).maybeSingle();
    setToday(t);
    const {
      data: h
    } = await supabase.from("attendance").select("*").eq("employee_id", user.id).order("date", {
      ascending: false
    }).limit(30);
    setHistory(h ?? []);
    const {
      data: myRegs
    } = await supabase.from("attendance_regularizations").select("*").eq("employee_id", user.id);
    setMyRegularizations(myRegs ?? []);
    const {
      data: offices
    } = await supabase.from("office_locations").select("*");
    const loadedOffices = offices ?? [];
    setAllOffices(loadedOffices);
    if (loadedOffices.length > 0) {
      let assigned = null;
      if (profile?.office_id) {
        assigned = loadedOffices.find((o) => o.id === profile.office_id);
      }
      if (!assigned) {
        assigned = loadedOffices.find((o) => o.name.toLowerCase().includes("neelgund"));
      }
      if (!assigned) {
        assigned = loadedOffices[0];
      }
      setAssignedOffice(assigned);
    }
    if (isElevated) {
      let profileQuery = supabase.from("profiles").select("id, name, email");
      if (role === "manager") {
        profileQuery = profileQuery.eq("manager_id", user.id);
      }
      const {
        data: profs
      } = await profileQuery;
      const validProfs = profs ?? [];
      setAllowedProfiles(validProfs);
      const map = {};
      validProfs.forEach((p) => {
        map[p.id] = p;
      });
      setProfileMap(map);
      const empIds = validProfs.map((p) => p.id);
      if (empIds.length > 0) {
        const {
          data: team
        } = await supabase.from("attendance").select("*").eq("date", selectedTeamDate).in("employee_id", empIds).order("created_at");
        const {
          data: pRegs
        } = await supabase.from("attendance_regularizations").select("*").eq("status", "pending").in("employee_id", empIds).order("created_at");
        setTeamToday(team ?? []);
        setPendingRegularizations(pRegs ?? []);
      } else {
        setTeamToday([]);
        setPendingRegularizations([]);
      }
    }
  };
  reactExports.useEffect(() => {
    if (today?.check_in_time && !today?.check_out_time) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        const start2 = new Date(today.check_in_time).getTime();
        const now2 = (/* @__PURE__ */ new Date()).getTime();
        const diffSeconds2 = Math.floor((now2 - start2) / 1e3);
        setLiveDuration(diffSeconds2);
      }, 1e3);
      const start = new Date(today.check_in_time).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const diffSeconds = Math.floor((now - start) / 1e3);
      setLiveDuration(diffSeconds);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
      setLiveDuration(0);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [today?.check_in_time, today?.check_out_time]);
  reactExports.useEffect(() => {
    load();
  }, [user, selectedTeamDate]);
  const addDays = (dateStr, days) => {
    const d = /* @__PURE__ */ new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const goBackDate = () => {
    setSelectedTeamDate((prev) => addDays(prev, -1));
  };
  const goForwardDate = () => {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    setSelectedTeamDate((prev) => {
      const next = addDays(prev, 1);
      return next <= todayStr ? next : prev;
    });
  };
  const formatTeamDateLabel = (dateStr) => {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (dateStr === todayStr) return "Today";
    const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    const yesterday = /* @__PURE__ */ new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().slice(0, 10)) return "Yesterday";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  reactExports.useEffect(() => {
    if (!assignedOffice) return;
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    const watchId = navigator.geolocation.watchPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      const dist = getDistance(userLat, userLon, assignedOffice.latitude, assignedOffice.longitude);
      setCurrentDistance(dist);
      setLocationError(null);
    }, (error) => {
      if (error.code === 1) setLocationError("Location permission denied");
      else setLocationError("Unable to fetch location");
    }, {
      enableHighAccuracy: true,
      maximumAge: 1e4,
      timeout: 5e3
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [assignedOffice]);
  const checkIn = async () => {
    if (!user) return;
    setBusy(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setBusy(false);
      return;
    }
    try {
      toast.info("Fetching your location...");
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 1e4,
          maximumAge: 0
        });
      });
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      const {
        data: offices,
        error: officeError
      } = await supabase.from("office_locations").select("id, name, latitude, longitude, radius_meters");
      if (officeError) throw officeError;
      if (offices && offices.length > 0) {
        let currentAssigned = null;
        if (profile?.office_id) {
          currentAssigned = offices.find((o) => o.id === profile.office_id);
        }
        if (!currentAssigned) {
          currentAssigned = offices.find((o) => o.name.toLowerCase().includes("neelgund"));
        }
        if (!currentAssigned) {
          currentAssigned = offices[0];
        }
        const distance = getDistance(userLat, userLon, currentAssigned.latitude, currentAssigned.longitude);
        if (distance > currentAssigned.radius_meters) {
          toast.error(`Check-in failed: You must be within the ${currentAssigned.name} location. You are ${Math.round(distance)}m away.`);
          setBusy(false);
          return;
        }
      }
      const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const {
        error
      } = await supabase.from("attendance").upsert({
        employee_id: user.id,
        date,
        check_in_time: (/* @__PURE__ */ new Date()).toISOString(),
        check_in_latitude: userLat,
        check_in_longitude: userLon,
        status: "present"
      }, {
        onConflict: "employee_id,date"
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Checked in! Timer started.");
      load();
    } catch (err) {
      setBusy(false);
      if (err.code === 1) toast.error("Please allow location access to check in.");
      else toast.error("Could not get your location. Please try again.");
    }
  };
  const checkOut = async () => {
    if (!user || !today) return;
    setBusy(true);
    let userLat = null;
    let userLon = null;
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5e3,
            maximumAge: 0
          });
        });
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
      } catch (err) {
      }
    }
    const checkOutTime = (/* @__PURE__ */ new Date()).toISOString();
    const workedHours = today.check_in_time ? (new Date(checkOutTime).getTime() - new Date(today.check_in_time).getTime()) / 36e5 : 0;
    const status = workedHours >= 8 ? "present" : workedHours >= 4 ? "half_day" : "absent";
    const {
      error
    } = await supabase.from("attendance").update({
      check_out_time: checkOutTime,
      check_out_latitude: userLat,
      check_out_longitude: userLon,
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", today.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Checked out! Total duration: ${formatDuration(Math.floor(workedHours * 60))}`);
    load();
  };
  const handleCardClick = (attendance) => {
    setSelectedAttendance(attendance);
    setShowDetailDialog(true);
  };
  const calculateDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime) return null;
    const start = new Date(checkInTime).getTime();
    const end = checkOutTime ? new Date(checkOutTime).getTime() : (/* @__PURE__ */ new Date()).getTime();
    const diffMinutes = Math.floor((end - start) / 6e4);
    return formatDuration(diffMinutes);
  };
  const isCheckedIn = !!today?.check_in_time;
  const isCheckedOut = !!today?.check_out_time;
  const submitRegularization = async () => {
    if (!user || !applyAttendance) return;
    setBusy(true);
    const inIso = (/* @__PURE__ */ new Date(`${applyAttendance.date}T${regCheckIn}:00+05:30`)).toISOString();
    const outIso = (/* @__PURE__ */ new Date(`${applyAttendance.date}T${regCheckOut}:00+05:30`)).toISOString();
    const {
      error
    } = await supabase.from("attendance_regularizations").insert({
      attendance_id: applyAttendance.id,
      employee_id: user.id,
      date: applyAttendance.date,
      requested_check_in_time: inIso,
      requested_check_out_time: outIso,
      reason: regReason,
      status: "pending"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Regularization requested");
    setShowApplyDialog(false);
    setRegReason("");
    load();
  };
  const resolveRegularization = async (id, status) => {
    setBusy(true);
    const {
      error
    } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Regularization ${status}`);
    setShowReviewDialog(false);
    load();
  };
  const submitManualAttendance = async () => {
    if (!manualEmpId || !manualDate) return toast.error("Please select an employee and date");
    setBusy(true);
    const inTime = manualStatus === "absent" ? null : (/* @__PURE__ */ new Date(`${manualDate}T${manualCheckIn}:00+05:30`)).toISOString();
    const outTime = manualStatus === "absent" ? null : manualCheckOut ? (/* @__PURE__ */ new Date(`${manualDate}T${manualCheckOut}:00+05:30`)).toISOString() : null;
    const {
      error
    } = await supabase.from("attendance").upsert({
      employee_id: manualEmpId,
      date: manualDate,
      check_in_time: inTime,
      check_out_time: outTime,
      status: manualStatus,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      onConflict: "employee_id,date"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Manual attendance recorded successfully");
    setShowManualDialog(false);
    load();
  };
  const handleExport = async () => {
    if (exportSelectedEmployees.length === 0) return toast.error("Please select at least one employee to export.");
    if (exportStartDate > exportEndDate) return toast.error("Start date cannot be after end date.");
    setBusy(true);
    const {
      data: attendanceData,
      error
    } = await supabase.from("attendance").select("*, profiles!inner(id, name, email)").in("employee_id", exportSelectedEmployees).gte("date", exportStartDate).lte("date", exportEndDate).order("date", {
      ascending: false
    });
    setBusy(false);
    if (error) {
      return toast.error("Failed to fetch export data: " + error.message);
    }
    if (!attendanceData || attendanceData.length === 0) {
      return toast.error("No attendance records found for the selected criteria.");
    }
    const headers = exportType === "pro" ? ["Date", "Employee Name", "Email", "Day Status", "Check In", "Check Out", "Duration"] : ["Date", "Employee Name", "Email", "Status", "Check In", "Check Out", "Duration"];
    const rows = attendanceData.map((record) => {
      const empName = record.profiles?.name || record.profiles?.email || "Unknown";
      const empEmail = record.profiles?.email || "Unknown";
      const inTime = record.check_in_time ? fmt(record.check_in_time) : "—";
      const outTime = record.check_out_time ? fmt(record.check_out_time) : "—";
      const duration = record.check_in_time && record.check_out_time ? calculateDuration(record.check_in_time, record.check_out_time) : "—";
      let statusStr = "";
      if (exportType === "pro") {
        if (record.status === "present") {
          statusStr = "P";
        } else if (record.status === "absent") {
          statusStr = "A";
        } else if (record.status === "half_day") {
          if (record.check_in_time) {
            const inHour = new Date(record.check_in_time).getHours();
            if (inHour < 12) {
              statusStr = "0.5 P / 0.5 A";
            } else {
              statusStr = "0.5 A / 0.5 P";
            }
          } else {
            statusStr = "0.5 P / 0.5 A";
          }
        } else {
          statusStr = "—";
        }
      } else {
        statusStr = record.status ? record.status.replace("_", " ") : "—";
      }
      return [record.date, `"${empName}"`, `"${empEmail}"`, `"${statusStr}"`, `"${inTime}"`, `"${outTime}"`, `"${duration}"`].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_${exportType === "pro" ? "Pro_" : ""}Export_${exportStartDate}_to_${exportEndDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful!");
    setShowExportDialog(false);
  };
  const toggleExportEmployee = (id) => {
    setExportSelectedEmployees((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };
  const toggleAllExportEmployees = () => {
    if (exportSelectedEmployees.length === allowedProfiles.length) {
      setExportSelectedEmployees([]);
    } else {
      setExportSelectedEmployees(allowedProfiles.map((p) => p.id));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Attendance", subtitle: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }) }),
      isElevated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-gray-100 p-1 rounded-xl shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setViewMode("daily"), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "daily" ? "bg-white text-[#154D8C] shadow-sm" : "text-gray-500 hover:text-gray-700"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-4 h-4" }),
          " Daily View"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setViewMode("monthly"), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "monthly" ? "bg-white text-[#154D8C] shadow-sm" : "text-gray-500 hover:text-gray-700"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4" }),
          " Monthly View"
        ] })
      ] })
    ] }),
    viewMode === "monthly" && isElevated ? /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyView, { allowedProfiles }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      assignedOffice ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: -10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl border flex items-center justify-between shadow-sm transition-colors ${locationError ? "bg-red-50 border-red-200" : currentDistance !== null && currentDistance <= assignedOffice.radius_meters ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          locationError ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-red-500" }) : currentDistance !== null && currentDistance <= assignedOffice.radius_meters ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-amber-500 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-gray-900", children: [
              "Assigned Office: ",
              assignedOffice.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs ${locationError ? "text-red-700" : "text-gray-600"}`, children: locationError ? locationError : currentDistance !== null ? `${Math.round(currentDistance)}m away (Radius: ${assignedOffice.radius_meters}m)` : "Locating..." })
          ] })
        ] }),
        currentDistance !== null && !locationError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs px-2 py-1 rounded-md font-semibold ${currentDistance <= assignedOffice.radius_meters ? "bg-green-100 text-green-800 border border-green-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`, children: currentDistance <= assignedOffice.radius_meters ? "In Range" : "Out of Range" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-sm text-gray-500 flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
        " No office locations defined. Geofencing disabled."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 8
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-2xl", style: {
        borderColor: "#154D8C20"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Today" }),
          today?.status && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[today.status] ?? "bg-muted text-muted-foreground"}`, children: today.status.replace("_", " ") })
        ] }),
        isCheckedIn && !isCheckedOut && (() => {
          const time = formatDurationSecondsObj(liveDuration);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 relative overflow-hidden p-6 bg-gradient-to-br from-slate-900 via-[#154D8C] to-[#0A2A52] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 shadow-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-2.5 w-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-blue-50 uppercase tracking-[0.2em]", children: "Active Shift" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 sm:gap-5 font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 backdrop-blur-md border border-white/20 text-white text-4xl sm:text-6xl font-black rounded-2xl p-3 sm:p-4 w-16 sm:w-24 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] tabular-nums transition-transform group-hover:scale-105", children: time.h }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-blue-200/80 mt-3 font-bold tracking-[0.2em]", children: "HOURS" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl sm:text-5xl text-blue-300/70 font-black self-start mt-2 sm:mt-4 animate-pulse", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 backdrop-blur-md border border-white/20 text-white text-4xl sm:text-6xl font-black rounded-2xl p-3 sm:p-4 w-16 sm:w-24 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] tabular-nums transition-transform group-hover:scale-105", children: time.m }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-blue-200/80 mt-3 font-bold tracking-[0.2em]", children: "MINS" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl sm:text-5xl text-blue-300/70 font-black self-start mt-2 sm:mt-4 animate-pulse", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-4xl sm:text-6xl font-black rounded-2xl p-3 sm:p-4 w-16 sm:w-24 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)] tabular-nums transition-transform group-hover:scale-105", children: time.s }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-blue-200/80 mt-3 font-bold tracking-[0.2em]", children: "SECS" })
                ] })
              ] })
            ] })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-muted/30 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Check In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: today?.check_in_time ? fmt(today.check_in_time) : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-muted/30 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Check Out" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: today?.check_out_time ? fmt(today.check_out_time) : "—" })
          ] })
        ] }),
        isCheckedIn && isCheckedOut && today?.check_in_time && today?.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-center p-2 bg-slate-100 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: "Total Duration: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: calculateDuration(today.check_in_time, today.check_out_time) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          !isCheckedIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: checkIn, disabled: busy, className: "flex-1 rounded-xl gap-2", style: {
            backgroundColor: "#154D8C"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
            "Check In"
          ] }),
          isCheckedIn && !isCheckedOut && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: checkOut, disabled: busy, variant: "outline", className: "flex-1 rounded-xl gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            "Check Out"
          ] }),
          isCheckedIn && isCheckedOut && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center text-sm text-muted-foreground py-2", children: "✓ Attendance recorded for today" })
        ] })
      ] }) }),
      isElevated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4", style: {
              color: "#154D8C"
            } }),
            "Team Attendance (",
            teamToday.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBackDate, className: "w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group flex items-center justify-center px-4 h-full min-w-[100px] hover:bg-gray-50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: selectedTeamDate, max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), onChange: (e) => setSelectedTeamDate(e.target.value), onClick: (e) => {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    try {
                      e.target.showPicker();
                    } catch (err) {
                    }
                  }
                }, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10", title: "Select Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-700 group-hover:text-[#154D8C] transition-colors whitespace-nowrap", children: formatTeamDateLabel(selectedTeamDate) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goForwardDate, disabled: selectedTeamDate >= (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), className: "w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100 disabled:opacity-30 disabled:hover:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-gray-600" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
              setExportType("standard");
              setExportSelectedEmployees(allowedProfiles.map((p) => p.id));
              setShowExportDialog(true);
            }, size: "sm", variant: "outline", className: "rounded-xl shadow-sm text-xs h-8 px-3 whitespace-nowrap bg-white text-[#154D8C] border-[#154D8C] hover:bg-slate-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-1.5" }),
              " Export"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
              setExportType("pro");
              setExportSelectedEmployees(allowedProfiles.map((p) => p.id));
              setShowExportDialog(true);
            }, size: "sm", className: "rounded-xl shadow-sm text-xs h-8 px-3 whitespace-nowrap bg-amber-500 text-white hover:bg-amber-600 border-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-1.5" }),
              " Export Pro"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowManualDialog(true), size: "sm", className: "bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-sm text-xs h-8 px-3 whitespace-nowrap", children: "+ Manual Entry" })
          ] })
        ] }),
        teamToday.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: teamToday.map((a) => {
          const employeeName = profileMap[a.employee_id]?.name || profileMap[a.employee_id]?.email || "Unknown";
          const isToday = a.date === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
          const isStillCheckedIn = isToday && a.check_in_time && !a.check_out_time;
          const missedCheckOut = !isToday && a.check_in_time && !a.check_out_time;
          const hasCompletedShift = a.check_in_time && a.check_out_time;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5", style: {
            borderColor: "#154D8C20"
          }, onClick: () => handleCardClick({
            ...a,
            employeeName
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0", style: {
              backgroundColor: "#154D8C"
            }, children: employeeName?.[0]?.toUpperCase() ?? "?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: employeeName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                a.check_in_time ? fmt(a.check_in_time) : "—",
                " ",
                a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""
              ] }),
              isStillCheckedIn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTimer, { startTime: a.check_in_time, isActive: true }) }),
              missedCheckOut && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-red-500 flex items-center gap-1 mt-1 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
                "Missed Check-out"
              ] }),
              hasCompletedShift && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 flex items-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                "Duration: ",
                calculateDuration(a.check_in_time, a.check_out_time)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`, children: a.status?.replace("_", " ") }),
            isStillCheckedIn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" }) })
          ] }, a.id);
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6 bg-slate-50 border border-slate-100 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-slate-300 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-500", children: [
            "No team attendance recorded for ",
            new Date(selectedTeamDate).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short"
            }),
            "."
          ] })
        ] })
      ] }),
      isElevated && pendingRegularizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500" }),
          "Pending Regularizations (",
          pendingRegularizations.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: pendingRegularizations.map((r) => {
          const employeeName = profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "Unknown";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5 rounded-xl cursor-pointer hover:shadow-md transition-shadow border-amber-200 bg-amber-50/50", onClick: () => {
            setReviewReg({
              ...r,
              employeeName
            });
            setShowReviewDialog(true);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-gray-900", children: employeeName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-amber-100 text-amber-700 border-amber-200", children: fmtDate(r.date) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 mb-1.5 line-clamp-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700", children: "Reason:" }),
              " ",
              r.reason || "No reason provided"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-gray-500 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
              "Req: ",
              r.requested_check_in_time ? fmt(r.requested_check_in_time) : "",
              " - ",
              r.requested_check_out_time ? fmt(r.requested_check_out_time) : ""
            ] })
          ] }, r.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Recent History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl divide-y", style: {
          borderColor: "#154D8C20"
        }, children: [
          history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "No attendance records yet" }),
          history.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0
          }, animate: {
            opacity: 1
          }, transition: {
            delay: i * 0.02
          }, className: "flex items-center gap-3 p-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors", onClick: () => handleCardClick({
            ...a,
            employeeName: user?.email?.split("@")[0] || "You"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: fmtDate(a.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                a.check_in_time ? fmt(a.check_in_time) : "No check-in",
                " ",
                a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`, children: a.status?.replace("_", " ") ?? "—" }),
              a.status === "absent" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-2", children: (() => {
                const existing = myRegularizations.find((r) => r.attendance_id === a.id);
                if (existing) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded-md border ${existing.status === "pending" ? "bg-blue-50 text-blue-600 border-blue-200" : existing.status === "approved" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`, children: [
                    "Reg. ",
                    existing.status
                  ] });
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-[10px] px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200", onClick: (e) => {
                  e.stopPropagation();
                  setApplyAttendance(a);
                  setShowApplyDialog(true);
                }, children: "Apply Reg." });
              })() })
            ] })
          ] }, a.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDetailDialog, onOpenChange: setShowDetailDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
            color: "#154D8C"
          }, children: "Attendance Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: selectedAttendance?.employeeName && `Employee: ${selectedAttendance.employeeName}` })
        ] }),
        selectedAttendance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmtDate(selectedAttendance.date) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selectedAttendance.status] ?? "bg-muted text-muted-foreground"}`, children: selectedAttendance.status?.replace("_", " ") || "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-blue-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-3 w-3" }),
                " Check In"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-base", children: selectedAttendance.check_in_time ? fmt(selectedAttendance.check_in_time) : "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-amber-50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
                " Check Out"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-base", children: selectedAttendance.check_out_time ? fmt(selectedAttendance.check_out_time) : "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-5 w-5 text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-blue-900", children: "Duration" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-blue-700", children: selectedAttendance.check_in_time ? calculateDuration(selectedAttendance.check_in_time, selectedAttendance.check_out_time) : "—" })
            ] }),
            selectedAttendance.check_in_time && !selectedAttendance.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-blue-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTimer, { startTime: selectedAttendance.check_in_time, isActive: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-blue-600 mt-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" }),
                "Still checked in - timer is live"
              ] })
            ] })
          ] }),
          selectedAttendance.check_in_time && selectedAttendance.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground", children: "Total working time recorded for this day" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showApplyDialog, onOpenChange: setShowApplyDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
            color: "#154D8C"
          }, children: "Apply Regularization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: applyAttendance && fmtDate(applyAttendance.date) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: regCheckIn, onChange: setRegCheckIn })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: regCheckOut, onChange: setRegCheckOut })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1 block", children: "Reason for absence/regularization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "w-full text-sm p-3 rounded-lg border border-gray-200 min-h-[80px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none", placeholder: "Forgot to punch in, approved field work...", value: regReason, onChange: (e) => setRegReason(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRegularization, disabled: busy || !regReason.trim(), className: "w-full rounded-xl gap-2", style: {
            backgroundColor: "#154D8C"
          }, children: "Submit Request" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showReviewDialog, onOpenChange: setShowReviewDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review Request" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            reviewReg?.employeeName,
            " • ",
            reviewReg && fmtDate(reviewReg.date)
          ] })
        ] }),
        reviewReg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Requested In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmt(reviewReg.requested_check_in_time) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Requested Out" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmt(reviewReg.requested_check_out_time) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1.5 font-medium", children: "Reason Provided" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-800 leading-relaxed", children: reviewReg.reason })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors", disabled: busy, onClick: () => resolveRegularization(reviewReg.id, "rejected"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-2" }),
              " Reject"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors", disabled: busy, onClick: () => resolveRegularization(reviewReg.id, "approved"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-2" }),
              " Approve"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showManualDialog, onOpenChange: setShowManualDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
            color: "#154D8C"
          }, children: "Manual Attendance Entry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Manually record attendance for an employee" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: manualEmpId, onChange: (e) => setManualEmpId(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Employee" }),
              allowedProfiles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name || p.email }, p.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: manualDate, max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), onChange: (e) => setManualDate(e.target.value), className: "w-full p-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]" })
          ] }),
          manualStatus !== "absent" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: manualCheckIn, onChange: setManualCheckIn })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: manualCheckOut, onChange: setManualCheckOut })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["present", "half_day", "absent"].map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setManualStatus(status), className: `flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${manualStatus === status ? status === "present" ? "bg-green-100 text-green-700 border-green-300" : status === "half_day" ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-red-100 text-red-700 border-red-300" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`, children: status.replace("_", " ") }, status)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitManualAttendance, disabled: busy || !manualEmpId || !manualDate, className: "w-full rounded-xl mt-2", style: {
            backgroundColor: "#154D8C"
          }, children: "Save Attendance" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showExportDialog, onOpenChange: setShowExportDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { style: {
            color: "#154D8C"
          }, className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5" }),
            " Export Attendance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Download attendance records as a CSV file" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: exportStartDate, max: exportEndDate, onChange: (e) => setExportStartDate(e.target.value), className: "w-full p-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: exportEndDate, min: exportStartDate, max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), onChange: (e) => setExportEndDate(e.target.value), className: "w-full p-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700", children: "Select Employees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggleAllExportEmployees, className: "text-xs text-[#154D8C] font-medium hover:underline", children: exportSelectedEmployees.length === allowedProfiles.length ? "Deselect All" : "Select All" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-48 overflow-y-auto", children: allowedProfiles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 p-2.5 hover:bg-white border-b border-gray-100 cursor-pointer transition-colors last:border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: exportSelectedEmployees.includes(p.id), onChange: () => toggleExportEmployee(p.id), className: "w-4 h-4 rounded text-[#154D8C] focus:ring-[#154D8C]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-gray-900 truncate", children: p.name || p.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 truncate", children: p.email })
              ] })
            ] }, p.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1.5 text-right", children: [
              exportSelectedEmployees.length,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleExport, disabled: busy || exportSelectedEmployees.length === 0, className: "w-full rounded-xl mt-2", style: {
            backgroundColor: "#154D8C"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
            " Download CSV"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AttendancePage as component
};
