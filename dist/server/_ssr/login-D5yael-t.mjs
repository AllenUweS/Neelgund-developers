import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CxMC999v.mjs";
import { U as User, L as Lock, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a wavy, smokey effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a glowing wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
const blurClassMap = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl"
};
function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#154D8C",
  className = ""
}) {
  const canvasRef = reactExports.useRef(null);
  const [mousePosition, setMousePosition] = reactExports.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = reactExports.useState(false);
  const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");
    let startTime = Date.now();
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);
    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      const currentTime = (Date.now() - startTime) / 1e3;
      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    render();
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering, mousePosition, color]);
  const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["sm"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute inset-0 w-full h-full overflow-hidden ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "w-full h-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 ${finalBlurClass}` })
  ] });
}
function LoginForm() {
  const [emailFocused, setEmailFocused] = reactExports.useState(false);
  const [passwordFocused, setPasswordFocused] = reactExports.useState(false);
  const [emailValue, setEmailValue] = reactExports.useState("");
  const [passwordValue, setPasswordValue] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(emailValue, passwordValue);
    setIsLoading(false);
    if (error) {
      alert("Login failed: " + error);
    } else {
      navigate({ to: "/dashboard" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm p-8 space-y-6 bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white px-2 py-2 mb-2 w-full flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo.svg", alt: "Neelgund Developers", className: "h-14 w-auto object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500 font-medium", children: "Sign in to continue" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-8", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            id: "floating_email",
            value: emailValue,
            onChange: (e) => setEmailValue(e.target.value),
            onFocus: () => setEmailFocused(true),
            onBlur: () => setEmailFocused(emailValue === "" ? false : true),
            className: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#154D8C] peer transition-colors duration-200",
            placeholder: " ",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "floating_email",
            className: "absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#154D8C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "inline-block mr-2 -mt-1", size: 16 }),
              "Email Address"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            id: "floating_password",
            value: passwordValue,
            onChange: (e) => setPasswordValue(e.target.value),
            onFocus: () => setPasswordFocused(true),
            onBlur: () => setPasswordFocused(passwordValue === "" ? false : true),
            className: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#154D8C] peer transition-colors duration-200",
            placeholder: " ",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: "floating_password",
            className: "absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#154D8C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "inline-block mr-2 -mt-1", size: 16 }),
              "Password"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-xs text-gray-500 hover:text-[#154D8C] font-medium transition", children: "Forgot Password?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "group w-full flex items-center justify-center py-3.5 px-4 bg-[#154D8C] hover:bg-[#113a6a] rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#154D8C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(21,77,140,0.2)] hover:shadow-[0_8px_25px_rgba(21,77,140,0.3)]",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                className: "animate-spin -ml-1 mr-2 h-5 w-5 text-white",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    }
                  )
                ]
              }
            ),
            "Signing in..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Sign In",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-gray-500", children: [
      "Don't have an account? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "font-bold text-[#154D8C] hover:text-[#113a6a] transition", children: "Sign Up" })
    ] })
  ] });
}
function LoginPage() {
  const {
    user,
    signIn
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) navigate({
      to: "/dashboard"
    });
  }, [user]);
  const handleSignIn = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
    else navigate({
      to: "/dashboard"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative w-screen h-screen bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SmokeyBackground, { className: "absolute inset-0", color: "#154D8C" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex items-center justify-center w-full h-full p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, { emailValue: email, onEmailChange: setEmail, passwordValue: password, onPasswordChange: setPassword, isLoading: busy, onSubmit: handleSignIn }) })
  ] });
}
export {
  LoginPage as component
};
