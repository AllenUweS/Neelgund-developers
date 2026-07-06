import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, s as supabase } from "./router-kA0jnLqi.mjs";
import { C as Card } from "./card-D4It2k98.mjs";
import { B as Badge } from "./badge-BfJxT4UD.mjs";
import { c as createLucideIcon } from "./createLucideIcon-Bp8knoDP.mjs";
import { m as motion } from "./proxy-CqksTbZr.mjs";
import { A as Activity, T as TrendingUp, R as ResponsiveContainer, a as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, b as Tooltip, c as Area, P as PieChart, d as Pie, e as Cell, L as Legend, B as BarChart, f as Bar } from "./AreaChart-BrRCYOZU.mjs";
import { L as Layers } from "./layers-BJlW-Kdf.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./utils-BH6shBk-.mjs";
import "./index-BNcWPUAp.mjs";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
      key: "pzmjnu"
    }
  ],
  ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83", key: "k2fpak" }]
];
const ChartPie = createLucideIcon("chart-pie", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];
function AnalyticsPage() {
  const {
    user,
    role
  } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  const [loading, setLoading] = reactExports.useState(true);
  const [productivity, setProductivity] = reactExports.useState([]);
  const [leadSources, setLeadSources] = reactExports.useState([]);
  const [leadPipeline, setLeadPipeline] = reactExports.useState([]);
  const [leadPriority, setLeadPriority] = reactExports.useState([]);
  reactExports.useEffect(() => {
    async function loadData() {
      if (!isElevated || !user) {
        setLoading(false);
        return;
      }
      try {
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateStr = thirtyDaysAgo.toLocaleDateString("en-CA");
        const {
          data: attData
        } = await supabase.from("attendance").select("date, status").gte("date", dateStr);
        const dateMap = {};
        for (let i = 29; i >= 0; i--) {
          const d = /* @__PURE__ */ new Date();
          d.setDate(d.getDate() - i);
          dateMap[d.toLocaleDateString("en-CA")] = 0;
        }
        (attData || []).forEach((a) => {
          if (a.status === "present" || a.status === "late_present" || a.status === "half_day") {
            if (dateMap[a.date] !== void 0) {
              dateMap[a.date]++;
            }
          }
        });
        setProductivity(Object.entries(dateMap).map(([d, present]) => ({
          date: new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }),
          present
        })));
        let allLeads = [];
        let start = 0;
        const step = 1e3;
        while (true) {
          const {
            data
          } = await supabase.from("leads").select("status, source, priority").range(start, start + step - 1);
          if (data) allLeads = allLeads.concat(data);
          if (!data || data.length < step) break;
          start += step;
        }
        const sourcesMap = {};
        allLeads.forEach((l) => {
          const s = (l.source || "unknown").replace(/_/g, " ");
          sourcesMap[s] = (sourcesMap[s] || 0) + 1;
        });
        setLeadSources(Object.entries(sourcesMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        })).sort((a, b) => b.value - a.value));
        const pipelineMap = {};
        allLeads.forEach((l) => {
          const s = l.status || "new";
          pipelineMap[s] = (pipelineMap[s] || 0) + 1;
        });
        setLeadPipeline([{
          stage: "New",
          count: pipelineMap["new"] || 0
        }, {
          stage: "Not Contacted",
          count: pipelineMap["not_contacted"] || 0
        }, {
          stage: "Follow-up",
          count: pipelineMap["follow_up"] || 0
        }, {
          stage: "Meeting",
          count: pipelineMap["meeting_scheduled"] || 0
        }, {
          stage: "Negotiation",
          count: pipelineMap["negotiation"] || 0
        }, {
          stage: "Won",
          count: pipelineMap["closed_won"] || 0
        }, {
          stage: "Lost",
          count: pipelineMap["closed_lost"] || 0
        }]);
        const priorityMap = {};
        allLeads.forEach((l) => {
          const p = l.priority || "unassigned";
          priorityMap[p] = (priorityMap[p] || 0) + 1;
        });
        setLeadPriority([{
          name: "Hot",
          value: priorityMap["hot"] || 0,
          color: "#EF4444"
        }, {
          name: "Warm",
          value: priorityMap["warm"] || 0,
          color: "#F59E0B"
        }, {
          name: "Cold",
          value: priorityMap["cold"] || 0,
          color: "#3B82F6"
        }].filter((p) => p.value > 0));
      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, isElevated]);
  if (!isElevated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[60vh] text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-16 w-16 text-red-500 mb-4 opacity-80" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Access Restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 max-w-sm", children: "Analytics and company-wide metrics are restricted to management and administrative roles." })
    ] });
  }
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1", children: "Analytics Command Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: "Deep insights and 30-day performance trends for the company." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full px-3 py-1 shadow-sm w-fit self-start sm:self-auto uppercase tracking-wider text-[10px]", children: "LIVE DATA" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 15
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.1
      }, className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "30-Day Workforce Productivity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Daily count of present employees" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-indigo-600" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: productivity, margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "prodGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#6366F1", stopOpacity: 0.4 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#6366F1", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#E5E7EB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", axisLine: false, tickLine: false, tick: {
            fill: "#9CA3AF",
            fontSize: 11
          }, dy: 10, minTickGap: 30 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
            fill: "#9CA3AF",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }, itemStyle: {
            color: "#6366F1",
            fontWeight: "bold"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "present", name: "Present Workforce", stroke: "#6366F1", strokeWidth: 3, fill: "url(#prodGradient)" })
        ] }) }) })
      ] }) }),
      role !== "hr" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.2
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Lead Sources" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Where are your leads coming from?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "h-5 w-5 text-gray-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: leadSources, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 75, outerRadius: 105, paddingAngle: 3, stroke: "none", children: leadSources.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { verticalAlign: "bottom", height: 36, iconType: "circle", wrapperStyle: {
            fontSize: "12px",
            color: "#4B5563"
          } })
        ] }) }) })
      ] }) }),
      role !== "hr" && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.3
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Lead Conversion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Pipeline health across all stages" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-5 w-5 text-gray-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: leadPipeline, margin: {
          top: 0,
          right: 0,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "pipeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#EC4899" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#FBCFE8" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#E5E7EB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "stage", axisLine: false, tickLine: false, tick: {
            fill: "#6B7280",
            fontSize: 10
          }, dy: 10 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
            fill: "#9CA3AF",
            fontSize: 11
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { cursor: {
            fill: "rgba(236, 72, 153, 0.05)"
          }, contentStyle: {
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }, itemStyle: {
            color: "#EC4899",
            fontWeight: "bold"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", name: "Leads", fill: "url(#pipeGradient)", radius: [4, 4, 0, 0], maxBarSize: 45 })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto grid grid-cols-3 gap-3", children: leadPriority.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black", style: {
            color: p.color
          }, children: p.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1", children: p.name })
        ] }, p.name)) })
      ] }) })
    ] })
  ] });
}
export {
  AnalyticsPage as component
};
