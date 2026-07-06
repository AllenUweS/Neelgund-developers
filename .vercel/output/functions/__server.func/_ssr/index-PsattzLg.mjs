import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, a as useNavigate } from "./router-kA0jnLqi.mjs";
import { L as LoaderCircle } from "./loader-circle-CYmj20TS.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./createLucideIcon-Bp8knoDP.mjs";
function Index() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    navigate({
      to: user ? "/dashboard" : "/login",
      replace: true
    });
  }, [user, loading, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
}
export {
  Index as component
};
