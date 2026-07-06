import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, s as supabase } from "./router-kA0jnLqi.mjs";
import { P as PageHeader } from "./PageHeader-D_JcINPd.mjs";
import { C as Card } from "./card-D4It2k98.mjs";
import { B as Bell } from "./bell-CwYxiAQh.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./utils-BH6shBk-.mjs";
import "./createLucideIcon-Bp8knoDP.mjs";
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
