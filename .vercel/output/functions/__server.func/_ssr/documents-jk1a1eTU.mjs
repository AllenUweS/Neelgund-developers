import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { F as FileText } from "../_libs/lucide-react.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Document center", subtitle: "Upload ID proofs, certificates, contracts." }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-12 flex flex-col items-center text-center border-dashed", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Storage bucket ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "px-1.5 py-0.5 rounded bg-muted", children: "documents" }),
      " is ready."
    ] })
  ] })
] });
export {
  SplitComponent as component
};
