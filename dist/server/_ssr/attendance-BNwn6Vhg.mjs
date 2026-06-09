import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth, s as supabase } from "./router-CxMC999v.mjs";
import { C as Card } from "./card-RGlIzTYo.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { B as Badge } from "./badge-DyfXZgLs.mjs";
import { P as PageHeader } from "./PageHeader-DRI_wP0r.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogDescription } from "./dialog-DAqyjhfK.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { j as CircleAlert, k as CircleCheck, C as Clock, a8 as LogIn, i as LogOut, e as Users, a9 as Timer, l as CircleX } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function fmt(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
function TimePicker12({
  value,
  onChange
}) {
  const [h, m] = value.split(":");
  const hour24 = parseInt(h, 10);
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 || 12;
  const handleHour = (e) => {
    let newH = parseInt(e.target.value, 10);
    if (isPm && newH !== 12) newH += 12;
    if (!isPm && newH === 12) newH = 0;
    onChange(`${newH.toString().padStart(2, "0")}:${m}`);
  };
  const handleMin = (e) => {
    onChange(`${h}:${e.target.value}`);
  };
  const handleAmPm = (e) => {
    const pm = e.target.value === "PM";
    let newH = hour24;
    if (pm && !isPm) newH = hour24 % 12 + 12;
    if (!pm && isPm) newH = hour24 % 12;
    onChange(`${newH.toString().padStart(2, "0")}:${m}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center bg-white border border-gray-200 rounded-lg p-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: hour12, onChange: handleHour, className: "p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center", children: Array.from({
      length: 12
    }, (_, i) => i + 1).map((hr) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: hr, children: hr.toString().padStart(2, "0") }, hr)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-400", children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: m, onChange: handleMin, className: "p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center", children: ["00", "15", "30", "45"].map((min) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: min, children: min }, min)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: isPm ? "PM" : "AM", onChange: handleAmPm, className: "p-1.5 text-sm font-semibold bg-gray-100 rounded text-[#1E3A5F] outline-none cursor-pointer flex-1 appearance-none text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AM", children: "AM" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PM", children: "PM" })
    ] })
  ] });
}
function LiveTimer({
  startTime,
  isActive
}) {
  const [duration, setDuration] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!isActive || !startTime) return;
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now2 = (/* @__PURE__ */ new Date()).getTime();
      const diffMinutes2 = Math.floor((now2 - start) / 6e4);
      setDuration(diffMinutes2);
    }, 6e4);
    const now = (/* @__PURE__ */ new Date()).getTime();
    const diffMinutes = Math.floor((now - start) / 6e4);
    setDuration(diffMinutes);
    return () => clearInterval(interval);
  }, [startTime, isActive]);
  if (!isActive || !startTime) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-blue-600 font-semibold", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "Duration: ",
      formatDuration(duration)
    ] })
  ] });
}
const statusColor = {
  present: "bg-green-100 text-green-700",
  half_day: "bg-amber-100 text-amber-700",
  absent: "bg-red-100 text-red-700"
};
function AttendancePage() {
  const {
    user,
    role
  } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager";
  const [today, setToday] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [teamToday, setTeamToday] = reactExports.useState([]);
  const [profileMap, setProfileMap] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  const [selectedAttendance, setSelectedAttendance] = reactExports.useState(null);
  const [showDetailDialog, setShowDetailDialog] = reactExports.useState(false);
  const [liveDuration, setLiveDuration] = reactExports.useState(0);
  const [myRegularizations, setMyRegularizations] = reactExports.useState([]);
  const [pendingRegularizations, setPendingRegularizations] = reactExports.useState([]);
  const [showApplyDialog, setShowApplyDialog] = reactExports.useState(false);
  const [applyAttendance, setApplyAttendance] = reactExports.useState(null);
  const [regReason, setRegReason] = reactExports.useState("");
  const [regCheckIn, setRegCheckIn] = reactExports.useState("09:00");
  const [regCheckOut, setRegCheckOut] = reactExports.useState("18:00");
  const [showReviewDialog, setShowReviewDialog] = reactExports.useState(false);
  const [reviewReg, setReviewReg] = reactExports.useState(null);
  const [allOffices, setAllOffices] = reactExports.useState([]);
  const [currentDistance, setCurrentDistance] = reactExports.useState(null);
  const [nearestOffice, setNearestOffice] = reactExports.useState(null);
  const [locationError, setLocationError] = reactExports.useState(null);
  const timerInterval = reactExports.useRef(null);
  const load = async () => {
    if (!user) return;
    const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const {
      data: t
    } = await supabase.from("attendance").select("*").eq("employee_id", user.id).eq("date", date).maybeSingle();
    setToday(t);
    const {
      data: h
    } = await supabase.from("attendance").select("*").eq("employee_id", user.id).order("date", {
      ascending: false
    }).limit(30);
    setHistory(h ?? []);
    const {
      data: myRegs
    } = await supabase.from("attendance_regularizations").select("*").eq("employee_id", user.id);
    setMyRegularizations(myRegs ?? []);
    const {
      data: offices
    } = await supabase.from("office_locations").select("*");
    setAllOffices(offices ?? []);
    if (isElevated) {
      const {
        data: team
      } = await supabase.from("attendance").select("*").eq("date", date).order("created_at");
      const {
        data: pRegs
      } = await supabase.from("attendance_regularizations").select("*").eq("status", "pending").order("created_at");
      const empIds = [.../* @__PURE__ */ new Set([...(team ?? []).map((a) => a.employee_id), ...(pRegs ?? []).map((r) => r.employee_id)])];
      if (empIds.length > 0) {
        const {
          data: profs
        } = await supabase.from("profiles").select("id, name, email").in("id", empIds);
        const map = {};
        (profs ?? []).forEach((p) => {
          map[p.id] = p;
        });
        setProfileMap(map);
      }
      setTeamToday(team ?? []);
      setPendingRegularizations(pRegs ?? []);
    }
  };
  reactExports.useEffect(() => {
    if (today?.check_in_time && !today?.check_out_time) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        const start2 = new Date(today.check_in_time).getTime();
        const now2 = (/* @__PURE__ */ new Date()).getTime();
        const diffMinutes2 = Math.floor((now2 - start2) / 6e4);
        setLiveDuration(diffMinutes2);
      }, 6e4);
      const start = new Date(today.check_in_time).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const diffMinutes = Math.floor((now - start) / 6e4);
      setLiveDuration(diffMinutes);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
      setLiveDuration(0);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [today?.check_in_time, today?.check_out_time]);
  reactExports.useEffect(() => {
    load();
  }, [user]);
  reactExports.useEffect(() => {
    if (allOffices.length === 0) return;
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    const watchId = navigator.geolocation.watchPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      let minDistance = Infinity;
      let closest = null;
      for (const office of allOffices) {
        const dist = getDistance(userLat, userLon, office.latitude, office.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closest = office;
        }
      }
      if (closest) {
        setCurrentDistance(minDistance);
        setNearestOffice(closest);
        setLocationError(null);
      }
    }, (error) => {
      if (error.code === 1) setLocationError("Location permission denied");
      else setLocationError("Unable to fetch location");
    }, {
      enableHighAccuracy: true,
      maximumAge: 1e4,
      timeout: 5e3
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [allOffices]);
  const checkIn = async () => {
    if (!user) return;
    setBusy(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setBusy(false);
      return;
    }
    try {
      toast.info("Fetching your location...");
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 1e4,
          maximumAge: 0
        });
      });
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      const {
        data: offices,
        error: officeError
      } = await supabase.from("office_locations").select("id, name, latitude, longitude, radius_meters");
      if (officeError) throw officeError;
      if (offices && offices.length > 0) {
        let isWithinGeofence = false;
        let minDistance = Infinity;
        for (const office of offices) {
          const distance = getDistance(userLat, userLon, office.latitude, office.longitude);
          if (distance < minDistance) {
            minDistance = distance;
          }
          if (distance <= office.radius_meters) {
            isWithinGeofence = true;
            break;
          }
        }
        if (!isWithinGeofence) {
          toast.error(`Check-in failed: You are not within any office location. Nearest is ${Math.round(minDistance)}m away.`);
          setBusy(false);
          return;
        }
      }
      const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const {
        error
      } = await supabase.from("attendance").upsert({
        employee_id: user.id,
        date,
        check_in_time: (/* @__PURE__ */ new Date()).toISOString(),
        check_in_latitude: userLat,
        check_in_longitude: userLon,
        status: "present"
      }, {
        onConflict: "employee_id,date"
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Checked in! Timer started.");
      load();
    } catch (err) {
      setBusy(false);
      if (err.code === 1) toast.error("Please allow location access to check in.");
      else toast.error("Could not get your location. Please try again.");
    }
  };
  const checkOut = async () => {
    if (!user || !today) return;
    setBusy(true);
    let userLat = null;
    let userLon = null;
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5e3,
            maximumAge: 0
          });
        });
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
      } catch (err) {
      }
    }
    const checkOutTime = (/* @__PURE__ */ new Date()).toISOString();
    const workedHours = today.check_in_time ? (new Date(checkOutTime).getTime() - new Date(today.check_in_time).getTime()) / 36e5 : 0;
    const status = workedHours >= 8 ? "present" : workedHours >= 4 ? "half_day" : "absent";
    const {
      error
    } = await supabase.from("attendance").update({
      check_out_time: checkOutTime,
      check_out_latitude: userLat,
      check_out_longitude: userLon,
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", today.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Checked out! Total duration: ${formatDuration(Math.floor(workedHours * 60))}`);
    load();
  };
  const handleCardClick = (attendance) => {
    setSelectedAttendance(attendance);
    setShowDetailDialog(true);
  };
  const calculateDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime) return null;
    const start = new Date(checkInTime).getTime();
    const end = checkOutTime ? new Date(checkOutTime).getTime() : (/* @__PURE__ */ new Date()).getTime();
    const diffMinutes = Math.floor((end - start) / 6e4);
    return formatDuration(diffMinutes);
  };
  const isCheckedIn = !!today?.check_in_time;
  const isCheckedOut = !!today?.check_out_time;
  const submitRegularization = async () => {
    if (!user || !applyAttendance) return;
    setBusy(true);
    const inIso = (/* @__PURE__ */ new Date(`${applyAttendance.date}T${regCheckIn}:00+05:30`)).toISOString();
    const outIso = (/* @__PURE__ */ new Date(`${applyAttendance.date}T${regCheckOut}:00+05:30`)).toISOString();
    const {
      error
    } = await supabase.from("attendance_regularizations").insert({
      attendance_id: applyAttendance.id,
      employee_id: user.id,
      date: applyAttendance.date,
      requested_check_in_time: inIso,
      requested_check_out_time: outIso,
      reason: regReason,
      status: "pending"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Regularization requested");
    setShowApplyDialog(false);
    setRegReason("");
    load();
  };
  const resolveRegularization = async (id, status) => {
    setBusy(true);
    const {
      error
    } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Regularization ${status}`);
    setShowReviewDialog(false);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Attendance", subtitle: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }) }),
    allOffices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: -10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl border flex items-center justify-between shadow-sm transition-colors ${locationError ? "bg-red-50 border-red-200" : currentDistance !== null && nearestOffice && currentDistance <= nearestOffice.radius_meters ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        locationError ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-red-500" }) : currentDistance !== null && nearestOffice && currentDistance <= nearestOffice.radius_meters ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-amber-500 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-gray-900", children: "Location Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs ${locationError ? "text-red-700" : "text-gray-600"}`, children: locationError ? locationError : currentDistance !== null ? `Nearest Office: ${nearestOffice.name} (${Math.round(currentDistance)}m away)` : "Locating..." })
        ] })
      ] }),
      currentDistance !== null && !locationError && nearestOffice && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: currentDistance <= nearestOffice.radius_meters ? "bg-green-100 text-green-800 border-green-300" : "bg-amber-100 text-amber-800 border-amber-300", children: currentDistance <= nearestOffice.radius_meters ? "In Range" : "Out of Range" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 rounded-2xl", style: {
      borderColor: "#154D8C20"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Today" }),
        today?.status && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[today.status] ?? "bg-muted text-muted-foreground"}`, children: today.status.replace("_", " ") })
      ] }),
      isCheckedIn && !isCheckedOut && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-blue-600 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-blue-900", children: "Live Timer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-700", children: formatDuration(liveDuration) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Check In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: today?.check_in_time ? fmt(today.check_in_time) : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-muted/30 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Check Out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: today?.check_out_time ? fmt(today.check_out_time) : "—" })
        ] })
      ] }),
      isCheckedIn && isCheckedOut && today?.check_in_time && today?.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-center p-2 bg-slate-100 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: "Total Duration: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: calculateDuration(today.check_in_time, today.check_out_time) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        !isCheckedIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: checkIn, disabled: busy, className: "flex-1 rounded-xl gap-2", style: {
          backgroundColor: "#154D8C"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
          "Check In"
        ] }),
        isCheckedIn && !isCheckedOut && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: checkOut, disabled: busy, variant: "outline", className: "flex-1 rounded-xl gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          "Check Out"
        ] }),
        isCheckedIn && isCheckedOut && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center text-sm text-muted-foreground py-2", children: "✓ Attendance recorded for today" })
      ] })
    ] }) }),
    isElevated && teamToday.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4", style: {
          color: "#154D8C"
        } }),
        "Team Today (",
        teamToday.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: teamToday.map((a) => {
        const employeeName = profileMap[a.employee_id]?.name || profileMap[a.employee_id]?.email || "Unknown";
        const isStillCheckedIn = a.check_in_time && !a.check_out_time;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5", style: {
          borderColor: "#154D8C20"
        }, onClick: () => handleCardClick({
          ...a,
          employeeName
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0", style: {
            backgroundColor: "#154D8C"
          }, children: employeeName?.[0]?.toUpperCase() ?? "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: employeeName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              a.check_in_time ? fmt(a.check_in_time) : "—",
              " ",
              a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""
            ] }),
            isStillCheckedIn && a.check_in_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-blue-600 flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTimer, { startTime: a.check_in_time, isActive: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`, children: a.status?.replace("_", " ") }),
          isStillCheckedIn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" }) })
        ] }, a.id);
      }) })
    ] }),
    isElevated && pendingRegularizations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500" }),
        "Pending Regularizations (",
        pendingRegularizations.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: pendingRegularizations.map((r) => {
        const employeeName = profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "Unknown";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5 rounded-xl cursor-pointer hover:shadow-md transition-shadow border-amber-200 bg-amber-50/50", onClick: () => {
          setReviewReg({
            ...r,
            employeeName
          });
          setShowReviewDialog(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-gray-900", children: employeeName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-amber-100 text-amber-700 border-amber-200", children: fmtDate(r.date) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 mb-1.5 line-clamp-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700", children: "Reason:" }),
            " ",
            r.reason || "No reason provided"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-gray-500 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
            "Req: ",
            r.requested_check_in_time ? fmt(r.requested_check_in_time) : "",
            " - ",
            r.requested_check_out_time ? fmt(r.requested_check_out_time) : ""
          ] })
        ] }, r.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Recent History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl divide-y", style: {
        borderColor: "#154D8C20"
      }, children: [
        history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "No attendance records yet" }),
        history.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0
        }, animate: {
          opacity: 1
        }, transition: {
          delay: i * 0.02
        }, className: "flex items-center gap-3 p-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors", onClick: () => handleCardClick({
          ...a,
          employeeName: user?.email?.split("@")[0] || "You"
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: fmtDate(a.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              a.check_in_time ? fmt(a.check_in_time) : "No check-in",
              " ",
              a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`, children: a.status?.replace("_", " ") ?? "—" }),
            a.status === "absent" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-2", children: (() => {
              const existing = myRegularizations.find((r) => r.attendance_id === a.id);
              if (existing) {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded-md border ${existing.status === "pending" ? "bg-blue-50 text-blue-600 border-blue-200" : existing.status === "approved" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`, children: [
                  "Reg. ",
                  existing.status
                ] });
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-[10px] px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200", onClick: (e) => {
                e.stopPropagation();
                setApplyAttendance(a);
                setShowApplyDialog(true);
              }, children: "Apply Reg." });
            })() })
          ] })
        ] }, a.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDetailDialog, onOpenChange: setShowDetailDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
          color: "#154D8C"
        }, children: "Attendance Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: selectedAttendance?.employeeName && `Employee: ${selectedAttendance.employeeName}` })
      ] }),
      selectedAttendance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmtDate(selectedAttendance.date) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selectedAttendance.status] ?? "bg-muted text-muted-foreground"}`, children: selectedAttendance.status?.replace("_", " ") || "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-blue-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-3 w-3" }),
              " Check In"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-base", children: selectedAttendance.check_in_time ? fmt(selectedAttendance.check_in_time) : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-amber-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
              " Check Out"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-base", children: selectedAttendance.check_out_time ? fmt(selectedAttendance.check_out_time) : "—" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-blue-900", children: "Duration" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-blue-700", children: selectedAttendance.check_in_time ? calculateDuration(selectedAttendance.check_in_time, selectedAttendance.check_out_time) : "—" })
          ] }),
          selectedAttendance.check_in_time && !selectedAttendance.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTimer, { startTime: selectedAttendance.check_in_time, isActive: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-blue-600 mt-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" }),
              "Still checked in - timer is live"
            ] })
          ] })
        ] }),
        selectedAttendance.check_in_time && selectedAttendance.check_out_time && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground", children: "Total working time recorded for this day" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showApplyDialog, onOpenChange: setShowApplyDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { style: {
          color: "#154D8C"
        }, children: "Apply Regularization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: applyAttendance && fmtDate(applyAttendance.date) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check In Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: regCheckIn, onChange: setRegCheckIn })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1.5 block", children: "Check Out Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TimePicker12, { value: regCheckOut, onChange: setRegCheckOut })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-gray-700 mb-1 block", children: "Reason for absence/regularization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "w-full text-sm p-3 rounded-lg border border-gray-200 min-h-[80px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none", placeholder: "Forgot to punch in, approved field work...", value: regReason, onChange: (e) => setRegReason(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRegularization, disabled: busy || !regReason.trim(), className: "w-full rounded-xl gap-2", style: {
          backgroundColor: "#154D8C"
        }, children: "Submit Request" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showReviewDialog, onOpenChange: setShowReviewDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          reviewReg?.employeeName,
          " • ",
          reviewReg && fmtDate(reviewReg.date)
        ] })
      ] }),
      reviewReg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Requested In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmt(reviewReg.requested_check_in_time) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1", children: "Requested Out" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: fmt(reviewReg.requested_check_out_time) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mb-1.5 font-medium", children: "Reason Provided" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-800 leading-relaxed", children: reviewReg.reason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors", disabled: busy, onClick: () => resolveRegularization(reviewReg.id, "rejected"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-2" }),
            " Reject"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors", disabled: busy, onClick: () => resolveRegularization(reviewReg.id, "approved"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-2" }),
            " Approve"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AttendancePage as component
};
