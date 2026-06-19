import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-DHg9ZSsH.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import "../_libs/sonner.mjs";
import { g as Bell } from "../_libs/lucide-react.mjs";
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
function NotificationsPage() {
  const {
    user
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).then(({
      data
    }) => setItems(data ?? []));
  }, [user]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Notifications", subtitle: "Stay on top of your day." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl divide-y", children: [
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-muted-foreground/50" }),
        "You're all caught up."
      ] }),
      items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full mt-2 ${n.read ? "bg-muted" : "bg-primary"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: n.title }),
          n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: n.body })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(n.created_at).toLocaleDateString() })
      ] }, n.id))
    ] })
  ] });
}
export {
  NotificationsPage as component
};
