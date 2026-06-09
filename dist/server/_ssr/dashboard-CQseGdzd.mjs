import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-CxMC999v.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { a5 as Activity, a6 as Sparkles, e as Users, k as CircleCheck, s as MapPin, B as Briefcase, a7 as TrendingUp } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, P as PieChart, b as Pie, c as Cell, B as BarChart, d as Bar } from "../_libs/recharts.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function DashboardPage() {
  const {
    user,
    role
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(true);
  const [totalEmployees, setTotalEmployees] = reactExports.useState(0);
  const [totalLeads, setTotalLeads] = reactExports.useState(0);
  const [leadsByStage, setLeadsByStage] = reactExports.useState([]);
  const [pieData, setPieData] = reactExports.useState([]);
  const [attendanceTrend, setAttendanceTrend] = reactExports.useState([]);
  const [inTheField, setInTheField] = reactExports.useState(0);
  const [presentToday, setPresentToday] = reactExports.useState(0);
  const [attendancePct, setAttendancePct] = reactExports.useState(0);
  const h = (/* @__PURE__ */ new Date()).getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  reactExports.useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
      try {
        const {
          count: empCount
        } = await supabase.from("profiles").select("*", {
          count: "exact",
          head: true
        });
        const totalEmp = empCount || 0;
        setTotalEmployees(totalEmp);
        let allLeads = [];
        let start = 0;
        const step = 1e3;
        while (true) {
          const {
            data
          } = await supabase.from("leads").select("status").range(start, start + step - 1);
          if (data) allLeads = allLeads.concat(data);
          if (!data || data.length < step) break;
          start += step;
        }
        setTotalLeads(allLeads.length);
        const leadCounts = {};
        allLeads.forEach((l) => {
          const s = l.status || "new";
          leadCounts[s] = (leadCounts[s] || 0) + 1;
        });
        setLeadsByStage([{
          stage: "New",
          v: leadCounts["new"] || 0
        }, {
          stage: "Follow-up",
          v: leadCounts["follow_up"] || 0
        }, {
          stage: "Meeting",
          v: leadCounts["meeting_scheduled"] || 0
        }, {
          stage: "Negotiation",
          v: leadCounts["negotiation"] || 0
        }, {
          stage: "Won",
          v: leadCounts["closed_won"] || 0
        }]);
        const {
          data: todayAtt
        } = await supabase.from("attendance").select("*").eq("date", today);
        let present = 0, late = 0, half = 0, absent = 0, inField = 0;
        (todayAtt || []).forEach((a) => {
          if (a.check_in_time && !a.check_out_time) inField++;
          let effStatus = a.status;
          if (a.check_in_time) {
            const start2 = new Date(a.check_in_time).getTime();
            const end = a.check_out_time ? new Date(a.check_out_time).getTime() : (/* @__PURE__ */ new Date()).getTime();
            const workedHours = (end - start2) / 36e5;
            if (workedHours >= 8) effStatus = "present";
            else if (workedHours >= 4) effStatus = "half_day";
            else effStatus = "absent";
            if (a.status === "late_present" || a.is_late) {
              if (effStatus === "present") effStatus = "late_present";
            }
          }
          if (effStatus === "half_day") {
            half++;
          } else if (effStatus === "absent") {
            absent++;
          } else if (effStatus === "late_present") {
            late++;
          } else if (effStatus === "present") {
            present++;
          }
        });
        const totalMarked = present + late + half + absent;
        const notInYet = Math.max(0, totalEmp - totalMarked);
        setPresentToday(present + late + half);
        setInTheField(inField);
        setAttendancePct(totalEmp > 0 ? Math.round((present + late + half) / totalEmp * 100) : 0);
        setPieData([
          {
            name: "Present",
            v: present,
            c: "#10B981"
          },
          // Emerald
          {
            name: "Late",
            v: late,
            c: "#F59E0B"
          },
          // Amber
          {
            name: "Half Day",
            v: half,
            c: "#3B82F6"
          },
          // Blue
          {
            name: "Absent",
            v: absent,
            c: "#EF4444"
          },
          // Red
          {
            name: "Not in yet",
            v: notInYet,
            c: "#E5E7EB"
          }
          // Gray
        ].filter((item) => item.v > 0));
        const past7Days = Array.from({
          length: 7
        }).map((_, i) => {
          const d = /* @__PURE__ */ new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString("en-CA");
        });
        const {
          data: weekAtt
        } = await supabase.from("attendance").select("date, status").in("date", past7Days);
        const trendMap = {};
        past7Days.forEach((d) => trendMap[d] = 0);
        (weekAtt || []).forEach((a) => {
          if (a.status === "present" || a.status === "late_present" || a.status === "half_day") {
            trendMap[a.date]++;
          }
        });
        setAttendanceTrend(past7Days.map((d) => ({
          day: new Date(d).toLocaleDateString("en-US", {
            weekday: "short"
          }),
          present: trendMap[d]
        })));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
      rotate: 360
    }, transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-8 w-8 text-[#154D8C] opacity-50" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#154D8C] via-[#1E3A8A] to-[#312E81] p-8 sm:p-10 text-white shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-64 h-64" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight mb-2", children: [
            greet,
            ", ",
            user?.email?.split("@")[0] ?? "there",
            "!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-100/80 max-w-lg text-sm sm:text-base", children: [
            "Here is your live intelligence overview for the ",
            role?.replace("_", " "),
            " workspace. Everything is syncing in real-time."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 hover:bg-white/30 text-white border-none rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm w-fit self-start sm:self-auto", children: role?.toUpperCase() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [{
      label: "Total Workforce",
      value: totalEmployees,
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20"
    }, {
      label: "Active Today",
      value: presentToday,
      hint: `${attendancePct}% attendance`,
      icon: CircleCheck,
      color: "from-emerald-400 to-green-500",
      shadow: "shadow-emerald-500/20"
    }, {
      label: "In the Field",
      value: inTheField,
      hint: "Live Tracking",
      icon: MapPin,
      color: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-500/20"
    }, {
      label: "Total Leads",
      value: totalLeads,
      hint: "CRM Database",
      icon: Briefcase,
      color: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/20"
    }].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: 0.1 + i * 0.05
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden p-6 rounded-3xl border-0 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${s.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} ${s.shadow} flex items-center justify-center text-white shadow-lg`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-6 w-6" }) }),
        s.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-full", children: s.hint })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-gray-500", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-extrabold text-gray-900 tracking-tight", children: s.value })
      ] })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.3
      }, className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Attendance Pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "7-Day active workforce trend" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-blue-600" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-[260px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: attendanceTrend, margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorPresent", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.4 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#E5E7EB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", axisLine: false, tickLine: false, tick: {
            fill: "#9CA3AF",
            fontSize: 12
          }, dy: 10 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
            fill: "#9CA3AF",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          }, itemStyle: {
            color: "#111827",
            fontWeight: 600
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "present", name: "Present", stroke: "#3B82F6", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorPresent)" })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.4
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: "Live Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Today's workforce distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-[220px] relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, dataKey: "v", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 70, outerRadius: 95, paddingAngle: 4, stroke: "none", children: pieData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.c }, `cell-${index}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-black text-gray-900", children: [
              totalEmployees > 0 ? Math.round(presentToday / totalEmployees * 100) : 0,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold text-gray-400", children: "Present" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-2 gap-y-3 mt-6 bg-gray-50 p-4 rounded-2xl", children: pieData.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full shadow-sm", style: {
            backgroundColor: p.c
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-600", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-sm font-bold text-gray-900", children: p.v })
        ] }, p.name)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: 0.5
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Lead Pipeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Conversion breakdown by stage" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[#154D8C] border-[#154D8C]/20 bg-blue-50/50 rounded-full px-3 py-1", children: [
          totalLeads,
          " Total Leads"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: leadsByStage, margin: {
        top: 0,
        right: 0,
        left: -20,
        bottom: 0
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "barGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#8B5CF6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#C4B5FD" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#E5E7EB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "stage", axisLine: false, tickLine: false, tick: {
          fill: "#6B7280",
          fontSize: 12,
          fontWeight: 500
        }, dy: 10 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
          fill: "#9CA3AF",
          fontSize: 12
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { cursor: {
          fill: "rgba(139, 92, 246, 0.05)"
        }, contentStyle: {
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }, itemStyle: {
          color: "#8B5CF6",
          fontWeight: "bold"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "v", name: "Leads", fill: "url(#barGradient)", radius: [6, 6, 0, 0], maxBarSize: 60 })
      ] }) }) })
    ] }) })
  ] });
}
export {
  DashboardPage as component
};
