import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, O as Outlet, e as useRouterState, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./_ssr/router-DHg9ZSsH.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "./_libs/radix-ui__react-popover.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a as LoaderCircle, M as Menu, b as LayoutDashboard, C as Clock, c as CalendarCheck, B as Briefcase, d as Map, e as Users, F as FileText, f as ChartColumn, g as Bell, h as CircleUser, S as Settings, i as LogOut, j as CircleCheck, k as CircleX } from "./_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "./_libs/framer-motion.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/regularizations", label: "Regularizations", icon: CalendarCheck },
  { to: "/leads", label: "Leads CRM", icon: Briefcase, roles: ["employee", "admin", "super_admin", "manager", "transport"] },
  { to: "/map", label: "Live Map", icon: Map, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/employees", label: "Employees", icon: Users, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/hr-management", label: "HR Management", icon: Users, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: ChartColumn, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: CircleUser },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin", "super_admin"] }
];
function AppSidebar({
  className,
  onMobileClose,
  isMobile
}) {
  const { role, user, profile, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = items.filter((i) => !i.roles || role && i.roles.includes(role));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: className || "hidden md:flex w-64 flex-col bg-[#154D8C] text-white shadow-xl z-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 flex items-center justify-center px-5 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-white rounded-xl py-2 px-3 shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-v4.png?v=20260612", alt: "Neelgund Developers", className: "h-10 w-auto object-contain" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-5 space-y-1.5 overflow-y-auto", children: visible.map((item) => {
      const active = pathname === item.to;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          onClick: onMobileClose,
          className: `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "text-[#154D8C]" : "text-blue-100 hover:text-white hover:bg-white/10"}`,
          children: [
            active && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                layoutId: isMobile ? "active-nav-mobile" : "active-nav-desktop",
                className: "absolute inset-0 rounded-xl bg-white shadow-md",
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "relative h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative", children: item.label })
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 mb-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#154D8C] shadow-sm", children: (profile?.name || user?.email)?.[0]?.toUpperCase() ?? "U" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-white truncate", children: profile?.name || user?.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-blue-200", children: role?.replace("_", " ") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: signOut, className: "w-full justify-start gap-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] })
    ] })
  ] });
}
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
function NotificationsBell() {
  const { user, role } = useAuth();
  const isElevated = role === "hr" || role === "admin" || role === "super_admin" || role === "manager";
  const [pending, setPending] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const loadPending = async () => {
    if (!isElevated || !user) return;
    setLoading(true);
    try {
      let query = supabase.from("attendance_regularizations").select("*").eq("status", "pending").order("created_at", { ascending: false });
      const { data: rawRegs } = await query;
      if (!rawRegs || rawRegs.length === 0) {
        setPending([]);
        return;
      }
      let filteredRegs = rawRegs;
      let profileIds = [...new Set(rawRegs.map((r) => r.employee_id))];
      if (role === "manager") {
        const { data: directReports } = await supabase.from("profiles").select("id").eq("manager_id", user.id);
        const reportIds = new Set((directReports || []).map((p) => p.id));
        filteredRegs = rawRegs.filter((r) => reportIds.has(r.employee_id));
        profileIds = [...new Set(filteredRegs.map((r) => r.employee_id))];
      }
      if (filteredRegs.length === 0) {
        setPending([]);
        return;
      }
      const { data: profs } = await supabase.from("profiles").select("id, name, email").in("id", profileIds);
      const profMap = {};
      (profs || []).forEach((p) => profMap[p.id] = p);
      const enrichedRegs = filteredRegs.map((reg) => ({
        ...reg,
        profiles: profMap[reg.employee_id]
      }));
      setPending(enrichedRegs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (open) loadPending();
  }, [open, role, user]);
  reactExports.useEffect(() => {
    loadPending();
  }, [role, user]);
  const resolveReg = async (id, status) => {
    setBusy(true);
    const { error } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Regularization ${status}`);
    setPending((prev) => prev.filter((r) => r.id !== id));
  };
  if (!isElevated) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative p-2.5 rounded-full bg-white shadow-md border border-gray-100 hover:bg-slate-50 text-[#154D8C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#154D8C]/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
      pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white", children: pending.length > 99 ? "99+" : pending.length })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-80 p-0 rounded-2xl shadow-xl overflow-hidden border-gray-100 z-[60]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-gray-800 text-sm", children: "Pending Regularizations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#154D8C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold", children: [
          pending.length,
          " New"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[360px] overflow-y-auto", children: loading && pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-[#154D8C] animate-spin mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Loading requests..." })
      ] }) : pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-6 h-6 text-green-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800", children: "All caught up!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "No pending regularizations." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-50", children: pending.map((reg) => {
        const dateStr = new Date(reg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        const inTime = new Date(reg.requested_check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        const outTime = new Date(reg.requested_check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 hover:bg-blue-50/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-gray-900", children: reg.profiles?.name || reg.profiles?.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded", children: dateStr })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Requested:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                inTime,
                " - ",
                outTime
              ] })
            ] }),
            reg.reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500 italic mt-1 border-t border-gray-100 pt-1", children: [
              '"',
              reg.reason,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                disabled: busy,
                size: "sm",
                onClick: () => resolveReg(reg.id, "approved"),
                className: "flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 shadow-sm h-8 rounded-lg text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " Approve"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                disabled: busy,
                size: "sm",
                onClick: () => resolveReg(reg.id, "rejected"),
                className: "flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 shadow-sm h-8 rounded-lg text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " Reject"
                ]
              }
            )
          ] })
        ] }, reg.id);
      }) }) })
    ] })
  ] });
}
function AppLayout() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login",
      replace: true
    });
  }, [user, loading, navigate]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background w-full overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isMobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden", onClick: () => setIsMobileOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        x: "-100%"
      }, animate: {
        x: 0
      }, exit: {
        x: "-100%"
      }, transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3
      }, className: "fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-2xl flex bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { isMobile: true, className: "w-full flex flex-col h-full bg-[#154D8C] text-white shadow-xl z-20", onMobileClose: () => setIsMobileOpen(false) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 overflow-y-auto flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30 shadow-sm h-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-v4.png?v=20260612", alt: "Neelgund Developers", className: "h-8 w-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsBell, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsMobileOpen(true), className: "p-2 -mr-2 rounded-full hover:bg-slate-100 text-[#154D8C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#154D8C]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block absolute top-6 right-8 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsBell, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 py-8 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppLayout as component
};
