import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { S as Settings } from "../_libs/lucide-react.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Company settings", subtitle: "Super admin only — manage company-wide configuration." }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-12 text-center border-dashed flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md", children: "Departments, branches, roles, map and policy settings." })
  ] })
] });
export {
  SplitComponent as component
};
