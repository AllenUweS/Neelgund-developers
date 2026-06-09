import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate, O as Outlet, e as useRouterState, L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./_ssr/router-CxMC999v.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import "./_libs/sonner.mjs";
import { a as LoaderCircle, M as Menu, b as LayoutDashboard, C as Clock, c as CalendarCheck, B as Briefcase, d as Map, e as Users, F as FileText, f as ChartColumn, g as Bell, h as CircleUser, S as Settings, i as LogOut } from "./_libs/lucide-react.mjs";
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
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/regularizations", label: "Regularizations", icon: CalendarCheck },
  { to: "/leads", label: "Leads CRM", icon: Briefcase },
  { to: "/map", label: "Live Map", icon: Map, roles: ["admin", "super_admin", "manager"] },
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 flex items-center justify-center px-5 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-white rounded-xl py-2 px-3 shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.svg", alt: "Neelgund Developers", className: "h-10 w-auto object-contain" }) }) }),
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 overflow-y-auto flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.svg", alt: "Neelgund Developers", className: "h-8 w-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsMobileOpen(true), className: "p-2 -mr-2 rounded-full hover:bg-slate-100 text-[#154D8C] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 py-8 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppLayout as component
};
