import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { u as useAuth, s as supabase } from "./router-kA0jnLqi.mjs";
import { U as Users } from "./users-g1jX10OK.mjs";
import { C as ChevronLeft } from "./chevron-left-DKEbyP5h.mjs";
import { X } from "./x-DD9OPI7P.mjs";
import { c as createLucideIcon } from "./createLucideIcon-Bp8knoDP.mjs";
import { M as Map$1 } from "./map-BL34W2dZ.mjs";
import { R as RefreshCw, A as ArrowLeft } from "./refresh-cw-CVZEF4SK.mjs";
import { C as ChevronRight } from "./chevron-right-CGO018xF.mjs";
import { S as Search } from "./search-DqizMWow.mjs";
import { C as Clock } from "./clock-G-u5aefp.mjs";
import { M as MapPin } from "./map-pin-Cja6BU2D.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$8 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$8);
const __iconNode$7 = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
];
const List = createLucideIcon("list", __iconNode$7);
const __iconNode$6 = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const LocateFixed = createLucideIcon("locate-fixed", __iconNode$6);
const __iconNode$5 = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode$5);
const __iconNode$4 = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
];
const Pause = createLucideIcon("pause", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }],
  ["path", { d: "M22 4v16", key: "sih9yq" }]
];
const Signal = createLucideIcon("signal", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
];
const SkipBack = createLucideIcon("skip-back", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const MAPS_API_KEY = "AIzaSyCJdUM6zblxst89NiJhVsf8YfnpixabsrQ";
function todayStr() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const LIVE_THRESHOLD_MS = 5 * 60 * 1e3;
function isLive(iso) {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() <= LIVE_THRESHOLD_MS;
}
function isLastHour(iso) {
  if (!iso) return false;
  const diff = Date.now() - new Date(iso).getTime();
  return diff > LIVE_THRESHOLD_MS && diff < 60 * 60 * 1e3;
}
function timeAgo(iso) {
  if (!iso || new Date(iso).getFullYear() < 2e3) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function formatDuration(ms) {
  if (ms <= 0) return "-";
  const mins = Math.round(ms / 6e4);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
function formatDistance(m) {
  if (m >= 1e3) return `${(m / 1e3).toFixed(2)} KM`;
  return `${Math.round(m)} M`;
}
function formatTime(iso) {
  if (!iso || new Date(iso).getFullYear() < 2e3) return "-";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function formatDateLabel(date) {
  if (date === todayStr()) return "Today";
  const d = /* @__PURE__ */ new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function getUtcBoundsForLocalDate(dateStr) {
  const startLocal = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
  const endLocal = /* @__PURE__ */ new Date(dateStr + "T23:59:59.999");
  return {
    startUtcIso: startLocal.toISOString(),
    endUtcIso: endLocal.toISOString()
  };
}
function deriveTripSummary(trail) {
  if (trail.length === 0) return {
    totalDistanceM: 0,
    durationMs: 0,
    stops: [],
    gaps: [],
    firstAt: null,
    lastAt: null,
    avgSpeedKmh: 0,
    maxSpeedKmh: 0,
    points: []
  };
  const sorted = [...trail].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  let totalM = 0;
  let maxSpeed = 0;
  const movingSpeeds = [];
  const stops = [];
  const gaps = [];
  let stopNum = 0;
  const GAP_THRESHOLD_MS = 5 * 60 * 1e3;
  const STOP_RADIUS_M = 50;
  const STOP_DURATION_MS = 5 * 60 * 1e3;
  let stopStartIdx = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const distM = haversineMeters(prev.latitude, prev.longitude, cur.latitude, cur.longitude);
    totalM += distM;
    const s = cur.speedKmh ?? 0;
    if (s > maxSpeed) maxSpeed = s;
    if (s > 2) movingSpeeds.push(s);
    const timeDiff = new Date(cur.recordedAt).getTime() - new Date(prev.recordedAt).getTime();
    if (timeDiff > GAP_THRESHOLD_MS) {
      gaps.push({
        startAt: prev.recordedAt,
        endAt: cur.recordedAt,
        durationMs: timeDiff
      });
    }
    const distFromStart = haversineMeters(sorted[stopStartIdx].latitude, sorted[stopStartIdx].longitude, cur.latitude, cur.longitude);
    if (distFromStart > STOP_RADIUS_M) {
      const stopDurMs = new Date(prev.recordedAt).getTime() - new Date(sorted[stopStartIdx].recordedAt).getTime();
      if (stopDurMs >= STOP_DURATION_MS) {
        stopNum++;
        stops.push({
          id: `stop-${stopNum}`,
          number: stopNum,
          latitude: sorted[stopStartIdx].latitude,
          longitude: sorted[stopStartIdx].longitude,
          durationMs: stopDurMs,
          arrivedAt: sorted[stopStartIdx].recordedAt
        });
      }
      stopStartIdx = i;
    }
  }
  if (sorted.length > 0) {
    const lastIdx = sorted.length - 1;
    const stopDurMs = new Date(sorted[lastIdx].recordedAt).getTime() - new Date(sorted[stopStartIdx].recordedAt).getTime();
    if (stopDurMs >= STOP_DURATION_MS) {
      stopNum++;
      stops.push({
        id: `stop-${stopNum}`,
        number: stopNum,
        latitude: sorted[stopStartIdx].latitude,
        longitude: sorted[stopStartIdx].longitude,
        durationMs: stopDurMs,
        arrivedAt: sorted[stopStartIdx].recordedAt
      });
    }
  }
  const avgSpeed = movingSpeeds.length > 0 ? movingSpeeds.reduce((a, b) => a + b, 0) / movingSpeeds.length : 0;
  const firstAt = sorted[0]?.recordedAt ?? null;
  const lastAt = sorted[sorted.length - 1]?.recordedAt ?? null;
  const durationMs = firstAt && lastAt ? new Date(lastAt).getTime() - new Date(firstAt).getTime() : 0;
  return {
    totalDistanceM: totalM,
    durationMs,
    stops,
    gaps,
    firstAt,
    lastAt,
    avgSpeedKmh: avgSpeed,
    maxSpeedKmh: maxSpeed,
    points: sorted
  };
}
const geoCache = {};
const geoPending = /* @__PURE__ */ new Set();
async function reverseGeocode(lat, lng) {
  if (lat === 0 && lng === 0) return null;
  const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
  if (geoCache[key]) return geoCache[key];
  if (geoPending.has(key)) return null;
  geoPending.add(key);
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address|locality&key=${MAPS_API_KEY}`);
    const data = await res.json();
    if (data.status === "OK" && data.results?.length) {
      const parts = data.results[0].formatted_address.split(",").map((p) => p.trim()).filter(Boolean);
      const short = parts.slice(0, 3).join(", ");
      geoCache[key] = short;
      return short;
    }
  } catch {
  } finally {
    geoPending.delete(key);
  }
  return null;
}
function buildEmployeeMarkerSvg(initials, online, photoUrl) {
  const color = online ? "#1E3A5F" : "#94a3b8";
  if (photoUrl) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="22" fill="transparent" stroke="none"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="22" y="27" text-anchor="middle" font-size="13" font-weight="700" font-family="system-ui,sans-serif" fill="white">${initials}</text>
    ${online ? '<circle cx="34" cy="10" r="6" fill="#10B981" stroke="white" stroke-width="2"/>' : ""}
  </svg>`;
}
function buildNumberedStopSvg(num, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="18" y="23" text-anchor="middle" font-size="13" font-weight="700" font-family="system-ui,sans-serif" fill="white">${num}</text>
  </svg>`;
}
function MapPage() {
  const {
    user,
    role
  } = useAuth();
  const [view, setView] = reactExports.useState("fleet");
  const [mapListMode, setMapListMode] = reactExports.useState("map");
  const [selectedDate, setSelectedDate] = reactExports.useState(todayStr());
  const [selectedUserId, setSelectedUserId] = reactExports.useState(null);
  const [mapsReady, setMapsReady] = reactExports.useState(false);
  const [mapLoaded, setMapLoaded] = reactExports.useState(false);
  const [employees, setEmployees] = reactExports.useState([]);
  const [loadingEmployees, setLoadingEmployees] = reactExports.useState(false);
  const [landmarkCache, setLandmarkCache] = reactExports.useState({});
  const [activeFilter, setActiveFilter] = reactExports.useState("All");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [trail, setTrail] = reactExports.useState([]);
  const [stopLandmarks, setStopLandmarks] = reactExports.useState({});
  const [loadingTrail, setLoadingTrail] = reactExports.useState(false);
  const [isReplaying, setIsReplaying] = reactExports.useState(false);
  const [replayIndex, setReplayIndex] = reactExports.useState(0);
  const [replaySpeed, setReplaySpeed] = reactExports.useState(1);
  const [sheetExpanded, setSheetExpanded] = reactExports.useState(false);
  const [tileMode, setTileMode] = reactExports.useState("map");
  const myLocationMarkerRef = reactExports.useRef(null);
  const watchIdRef = reactExports.useRef(null);
  const fleetMapRef = reactExports.useRef(null);
  const tripMapRef = reactExports.useRef(null);
  const fleetMapInstanceRef = reactExports.useRef(null);
  const tripMapInstanceRef = reactExports.useRef(null);
  const employeeMarkersRef = reactExports.useRef({});
  const employeeLabelsRef = reactExports.useRef({});
  const employeeInfoWindowsRef = reactExports.useRef({});
  const tripPolylineRef = reactExports.useRef(null);
  const tripMarkersRef = reactExports.useRef([]);
  const playbackMarkerRef = reactExports.useRef(null);
  const summary = reactExports.useMemo(() => deriveTripSummary(trail), [trail]);
  const points = summary.points;
  const activePoint = points[Math.min(replayIndex, Math.max(points.length - 1, 0))] ?? null;
  const selectedEmployee = employees.find((e) => e.userId === selectedUserId) ?? null;
  const filteredEmployees = reactExports.useMemo(() => {
    let list = employees;
    if (activeFilter === "Live now") list = list.filter((e) => isLive(e.recordedAt));
    else if (activeFilter === "Last hour") list = list.filter((e) => isLastHour(e.recordedAt));
    else if (activeFilter === "Older") list = list.filter((e) => !isLive(e.recordedAt) && !isLastHour(e.recordedAt));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.designation ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [employees, activeFilter, searchQuery]);
  reactExports.useEffect(() => {
    if (window.google?.maps) {
      setMapsReady(true);
      return;
    }
    const existing = document.getElementById("gm-script-map");
    if (existing) {
      existing.addEventListener("load", () => setMapsReady(true));
      return;
    }
    window.initGoogleMaps = () => setMapsReady(true);
    const s = document.createElement("script");
    s.id = "gm-script-map";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initGoogleMaps`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);
  reactExports.useEffect(() => {
    if (!mapsReady || !fleetMapRef.current || fleetMapInstanceRef.current) return;
    if (view !== "fleet" || mapListMode !== "map") return;
    employeeMarkersRef.current = {};
    employeeLabelsRef.current = {};
    employeeInfoWindowsRef.current = {};
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current = null;
    }
    fleetMapInstanceRef.current = new window.google.maps.Map(fleetMapRef.current, {
      center: {
        lat: 15.3597,
        lng: 75.1239
      },
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      styles: [{
        featureType: "poi",
        stylers: [{
          visibility: "simplified"
        }]
      }]
    });
    setMapLoaded(true);
    setTimeout(() => setEmployees((prev) => {
      updateFleetMarkers(prev);
      return prev;
    }), 400);
  }, [mapsReady, view, mapListMode]);
  reactExports.useEffect(() => {
    if (!mapsReady || !tripMapRef.current || tripMapInstanceRef.current || view !== "trip") return;
    tripMapInstanceRef.current = new window.google.maps.Map(tripMapRef.current, {
      center: {
        lat: 15.3597,
        lng: 75.1239
      },
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: tileMode === "satellite" ? "satellite" : "roadmap",
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      }
    });
  }, [mapsReady, view]);
  reactExports.useEffect(() => {
    if (!tripMapInstanceRef.current || !window.google) return;
    tripMapInstanceRef.current.setMapTypeId(tileMode === "satellite" ? "satellite" : "roadmap");
  }, [tileMode]);
  const fetchEmployees = reactExports.useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const {
        startUtcIso,
        endUtcIso
      } = getUtcBoundsForLocalDate(selectedDate);
      let profileQuery = supabase.from("profiles").select("id, name, email, designation, profile_photo_url, role");
      if (role === "employee" && user?.id) {
        profileQuery = profileQuery.eq("id", user.id);
      }
      const {
        data: profileRows,
        error: profileErr
      } = await profileQuery;
      if (profileErr) {
        console.error("Error fetching profiles:", profileErr);
      }
      const allProfiles = /* @__PURE__ */ new Map();
      for (const p of profileRows ?? []) allProfiles.set(p.id, p);
      let latestByEmployee = /* @__PURE__ */ new Map();
      const {
        data: locRows
      } = await supabase.from("location_points").select("employee_id, latitude, longitude, recorded_at").gte("recorded_at", startUtcIso).lte("recorded_at", endUtcIso).order("recorded_at", {
        ascending: false
      }).limit(1e5);
      if (locRows && locRows.length > 0) {
        for (const row of locRows) {
          if (!latestByEmployee.has(row.employee_id)) latestByEmployee.set(row.employee_id, row);
        }
      } else {
        const {
          data: liveRows
        } = await supabase.from("live_locations").select("user_id, latitude, longitude, recorded_at").gte("recorded_at", startUtcIso).lte("recorded_at", endUtcIso).order("recorded_at", {
          ascending: false
        }).limit(1e5);
        for (const row of liveRows ?? []) {
          const empId = row.employee_id ?? row.user_id;
          if (!latestByEmployee.has(empId)) {
            latestByEmployee.set(empId, {
              employee_id: empId,
              latitude: row.latitude,
              longitude: row.longitude,
              recorded_at: row.recorded_at
            });
          }
        }
      }
      const allEmployeeIds = Array.from(allProfiles.keys());
      const trackerStateById = /* @__PURE__ */ new Map();
      const lastPingAtById = /* @__PURE__ */ new Map();
      if (allEmployeeIds.length > 0) {
        const {
          data: statusRows,
          error: statusErr
        } = await supabase.from("tracking_status").select("employee_id, tracker_state, last_ping_at").in("employee_id", allEmployeeIds);
        if (!statusErr && statusRows) {
          for (const row of statusRows) {
            if (row.tracker_state) trackerStateById.set(row.employee_id, row.tracker_state);
            if (row.last_ping_at) lastPingAtById.set(row.employee_id, row.last_ping_at);
          }
        }
      }
      const result = [];
      for (const [userId, locRow] of latestByEmployee) {
        const profile = allProfiles.get(userId);
        const lastPing = lastPingAtById.get(userId);
        const trackerState = trackerStateById.get(userId) ?? null;
        const displayTime = lastPing && new Date(lastPing) > new Date(locRow.recorded_at) ? lastPing : locRow.recorded_at;
        result.push({
          userId,
          name: profile?.name || profile?.email || "Unknown",
          email: profile?.email || "",
          avatarUrl: profile?.profile_photo_url ?? null,
          designation: profile?.designation ?? null,
          latitude: locRow.latitude,
          longitude: locRow.longitude,
          recordedAt: displayTime,
          trackerState
        });
      }
      for (const [id, profile] of allProfiles) {
        if (!latestByEmployee.has(id) && profile.role === "employee") {
          const lastPing = lastPingAtById.get(id) ?? null;
          result.push({
            userId: id,
            name: profile.name || profile.email || "Unknown",
            email: profile.email || "",
            avatarUrl: profile.profile_photo_url ?? null,
            designation: profile.designation ?? null,
            latitude: 0,
            longitude: 0,
            recordedAt: lastPing ?? (/* @__PURE__ */ new Date(0)).toISOString(),
            trackerState: trackerStateById.get(id) ?? "stopped"
          });
        }
      }
      result.sort((a, b) => {
        const aLive = isLive(a.recordedAt) ? 1 : 0;
        const bLive = isLive(b.recordedAt) ? 1 : 0;
        if (aLive !== bLive) return bLive - aLive;
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      });
      setEmployees(result);
      updateFleetMarkers(result);
      result.forEach((emp) => {
        if (emp.latitude !== 0 || emp.longitude !== 0) {
          reverseGeocode(emp.latitude, emp.longitude).then((addr) => {
            if (addr) setLandmarkCache((prev) => ({
              ...prev,
              [emp.userId]: addr
            }));
          });
        }
      });
    } finally {
      setLoadingEmployees(false);
    }
  }, [selectedDate, role, user?.id]);
  const fetchTrail = reactExports.useCallback(async (userId, date) => {
    setLoadingTrail(true);
    setTrail([]);
    setReplayIndex(0);
    setIsReplaying(false);
    try {
      const {
        startUtcIso,
        endUtcIso
      } = getUtcBoundsForLocalDate(date);
      let pts = [];
      let lpData = [];
      let start = 0;
      const PAGE_SIZE = 1e3;
      while (true) {
        const {
          data
        } = await supabase.from("location_points").select("latitude, longitude, recorded_at, speed_kmh").eq("employee_id", userId).gte("recorded_at", startUtcIso).lte("recorded_at", endUtcIso).order("recorded_at", {
          ascending: true
        }).range(start, start + PAGE_SIZE - 1);
        if (!data || data.length === 0) break;
        lpData = lpData.concat(data);
        if (data.length < PAGE_SIZE) break;
        start += PAGE_SIZE;
      }
      if (lpData && lpData.length > 0) {
        pts = lpData.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
          recordedAt: p.recorded_at,
          speedKmh: p.speed_kmh ?? null
        }));
      } else {
        let llData = [];
        let startLl = 0;
        while (true) {
          const {
            data
          } = await supabase.from("live_locations").select("latitude, longitude, recorded_at").eq("user_id", userId).gte("recorded_at", startUtcIso).lte("recorded_at", endUtcIso).order("recorded_at", {
            ascending: true
          }).range(startLl, startLl + PAGE_SIZE - 1);
          if (!data || data.length === 0) break;
          llData = llData.concat(data);
          if (data.length < PAGE_SIZE) break;
          startLl += PAGE_SIZE;
        }
        pts = (llData ?? []).map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
          recordedAt: p.recorded_at,
          speedKmh: null
        }));
      }
      for (let i = 1; i < pts.length; i++) {
        if (pts[i].speedKmh == null) {
          const distM = haversineMeters(pts[i - 1].latitude, pts[i - 1].longitude, pts[i].latitude, pts[i].longitude);
          const dtS = (new Date(pts[i].recordedAt).getTime() - new Date(pts[i - 1].recordedAt).getTime()) / 1e3;
          pts[i].speedKmh = dtS > 0 ? distM / dtS * 3.6 : 0;
        }
      }
      setTrail(pts);
    } finally {
      setLoadingTrail(false);
    }
  }, []);
  const updateFleetMarkers = reactExports.useCallback((emps) => {
    if (!fleetMapInstanceRef.current || !window.google) return;
    const currentIds = new Set(emps.map((e) => e.userId));
    Object.keys(employeeMarkersRef.current).forEach((uid) => {
      if (!currentIds.has(uid)) {
        employeeMarkersRef.current[uid].setMap(null);
        delete employeeMarkersRef.current[uid];
        if (employeeLabelsRef.current[uid]) {
          employeeLabelsRef.current[uid].setMap(null);
          delete employeeLabelsRef.current[uid];
        }
        if (employeeInfoWindowsRef.current[uid]) {
          employeeInfoWindowsRef.current[uid].close();
          delete employeeInfoWindowsRef.current[uid];
        }
      }
    });
    const plotted = emps.filter((e) => e.latitude !== 0 || e.longitude !== 0);
    plotted.forEach((emp) => {
      const pos = {
        lat: emp.latitude,
        lng: emp.longitude
      };
      const online = isLive(emp.recordedAt);
      const initials = emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
      const svg = buildEmployeeMarkerSvg(initials, online, emp.avatarUrl);
      const icon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22)
      };
      const makeIwContent = (landmark) => `
        <div style="font-family:system-ui,sans-serif;padding:6px 10px;min-width:140px;">
          <div style="font-weight:700;font-size:13px;color:#1E3A5F;">${emp.name}</div>
          ${emp.designation ? `<div style="font-size:11px;color:#64748b;margin-top:1px;">${emp.designation}</div>` : ""}
          <div style="font-size:11px;color:${online ? "#10B981" : "#94a3b8"};margin-top:3px;font-weight:600;">
            ${online ? "● Live now" : `Last seen ${timeAgo(emp.recordedAt)}`}
          </div>
          ${landmark ? `<div style="font-size:11px;color:#64748b;margin-top:3px;">📍 ${landmark}</div>` : ""}
          <div style="margin-top:8px;display:flex;gap:6px;">
            <button onclick="window.__mapLocate('${emp.userId}')" style="flex:1;padding:4px 8px;background:#f1f5f9;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:#1E3A5F;">Locate</button>
            <button onclick="window.__mapViewTrip('${emp.userId}')" style="flex:1;padding:4px 8px;background:#1E3A5F;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:white;">View Trip</button>
          </div>
        </div>`;
      if (employeeMarkersRef.current[emp.userId]) {
        employeeMarkersRef.current[emp.userId].setPosition(pos);
        employeeMarkersRef.current[emp.userId].setIcon(icon);
        const lm = geoCache[`${emp.latitude.toFixed(4)}_${emp.longitude.toFixed(4)}`];
        if (employeeInfoWindowsRef.current[emp.userId]) {
          employeeInfoWindowsRef.current[emp.userId].setContent(makeIwContent(lm));
        }
        const label = employeeLabelsRef.current[emp.userId];
        if (label && label._nameLabel) {
          label._nameLabel.textContent = emp.name;
        }
      } else {
        const infoWindow = new window.google.maps.InfoWindow({
          content: makeIwContent()
        });
        const marker = new window.google.maps.Marker({
          position: pos,
          map: fleetMapInstanceRef.current,
          icon,
          title: emp.name,
          zIndex: online ? 10 : 5
        });
        const labelOverlay = new window.google.maps.OverlayView();
        labelOverlay.onAdd = function() {
          const container = document.createElement("div");
          container.style.cssText = "position:absolute;pointer-events:none;display:flex;flex-direction:column;align-items:center;";
          const nameLabel = document.createElement("div");
          nameLabel.style.cssText = "background:rgba(30,58,95,0.88);color:white;font-size:11px;font-weight:600;font-family:system-ui,sans-serif;padding:2px 8px;border-radius:10px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.3);";
          nameLabel.textContent = emp.name;
          container.appendChild(nameLabel);
          if (emp.avatarUrl) {
            nameLabel.style.marginBottom = "6px";
            const avatarWrap = document.createElement("div");
            avatarWrap.style.cssText = `width:44px;height:44px;border-radius:50%;border:2px solid ${online ? "#1E3A5F" : "#94a3b8"};background-color:white;box-shadow:0 2px 6px rgba(0,0,0,0.3);position:relative;`;
            const img = document.createElement("img");
            img.src = emp.avatarUrl;
            img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
            avatarWrap.appendChild(img);
            if (online) {
              const dot = document.createElement("div");
              dot.style.cssText = "position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;background:#10B981;border:2px solid white;border-radius:50%;";
              avatarWrap.appendChild(dot);
            }
            container.appendChild(avatarWrap);
          }
          this._container = container;
          this._nameLabel = nameLabel;
          this.getPanes().overlayLayer.appendChild(container);
        };
        labelOverlay.draw = function() {
          const proj = this.getProjection();
          if (!proj || !this._container) return;
          const pt = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(emp.latitude, emp.longitude));
          if (!pt) return;
          const container = this._container;
          container.style.left = pt.x - container.offsetWidth / 2 + "px";
          if (emp.avatarUrl) {
            container.style.top = pt.y - container.offsetHeight + 22 + "px";
          } else {
            container.style.top = pt.y - 52 + "px";
          }
        };
        labelOverlay.onRemove = function() {
          if (this._container?.parentNode) {
            this._container.parentNode.removeChild(this._container);
          }
        };
        labelOverlay.setMap(fleetMapInstanceRef.current);
        marker.addListener("click", () => {
          Object.values(employeeInfoWindowsRef.current).forEach((iw) => iw.close());
          infoWindow.open(fleetMapInstanceRef.current, marker);
        });
        employeeMarkersRef.current[emp.userId] = marker;
        employeeLabelsRef.current[emp.userId] = labelOverlay;
        employeeInfoWindowsRef.current[emp.userId] = infoWindow;
      }
    });
    if (plotted.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      plotted.forEach((e) => bounds.extend({
        lat: e.latitude,
        lng: e.longitude
      }));
      fleetMapInstanceRef.current.fitBounds(bounds);
    } else if (plotted.length === 1) {
      fleetMapInstanceRef.current.setCenter({
        lat: plotted[0].latitude,
        lng: plotted[0].longitude
      });
      fleetMapInstanceRef.current.setZoom(15);
    }
  }, []);
  reactExports.useEffect(() => {
    window.__mapLocate = (userId) => {
      const emp = employees.find((e) => e.userId === userId);
      if (emp && fleetMapInstanceRef.current) {
        fleetMapInstanceRef.current.panTo({
          lat: emp.latitude,
          lng: emp.longitude
        });
        fleetMapInstanceRef.current.setZoom(16);
        Object.values(employeeInfoWindowsRef.current).forEach((iw) => iw.close());
      }
    };
    window.__mapViewTrip = (userId) => selectEmployee(userId);
  }, [employees]);
  reactExports.useEffect(() => {
    if (!fleetMapInstanceRef.current || !window.google) return;
    employees.forEach((emp) => {
      const landmark = landmarkCache[emp.userId];
      if (!landmark || !employeeInfoWindowsRef.current[emp.userId]) return;
      const online = isLive(emp.recordedAt);
      employeeInfoWindowsRef.current[emp.userId].setContent(`
        <div style="font-family:system-ui,sans-serif;padding:6px 10px;min-width:140px;">
          <div style="font-weight:700;font-size:13px;color:#1E3A5F;">${emp.name}</div>
          ${emp.designation ? `<div style="font-size:11px;color:#64748b;margin-top:1px;">${emp.designation}</div>` : ""}
          <div style="font-size:11px;color:${online ? "#10B981" : "#94a3b8"};margin-top:3px;font-weight:600;">
            ${online ? "● Live now" : `Last seen ${timeAgo(emp.recordedAt)}`}
          </div>
          <div style="font-size:11px;color:#64748b;margin-top:3px;">📍 ${landmark}</div>
          <div style="margin-top:8px;display:flex;gap:6px;">
            <button onclick="window.__mapLocate('${emp.userId}')" style="flex:1;padding:4px 8px;background:#f1f5f9;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:#1E3A5F;">Locate</button>
            <button onclick="window.__mapViewTrip('${emp.userId}')" style="flex:1;padding:4px 8px;background:#1E3A5F;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:white;">View Trip</button>
          </div>
        </div>`);
    });
  }, [landmarkCache, employees]);
  reactExports.useEffect(() => {
    if (!tripMapInstanceRef.current || !window.google || view !== "trip") return;
    if (tripPolylineRef.current) {
      tripPolylineRef.current.setMap(null);
      tripPolylineRef.current = null;
    }
    tripMarkersRef.current.forEach((m) => m.setMap(null));
    tripMarkersRef.current = [];
    if (playbackMarkerRef.current) {
      playbackMarkerRef.current.setMap(null);
      playbackMarkerRef.current = null;
    }
    if (points.length < 2) return;
    const pathCoords = points.map((p) => ({
      lat: p.latitude,
      lng: p.longitude
    }));
    tripPolylineRef.current = new window.google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: "#1E3A5F",
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map: tripMapInstanceRef.current
    });
    const addPin = (pos, num, color, zIndex = 4) => {
      const svg = buildNumberedStopSvg(num, color);
      tripMarkersRef.current.push(new window.google.maps.Marker({
        position: pos,
        map: tripMapInstanceRef.current,
        zIndex,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
          scaledSize: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(18, 18)
        }
      }));
    };
    addPin(pathCoords[0], "S", "#10B981", 5);
    addPin(pathCoords[pathCoords.length - 1], "E", "#EF4444", 5);
    summary.stops.forEach((stop) => addPin({
      lat: stop.latitude,
      lng: stop.longitude
    }, String(stop.number), "#F59E0B"));
    const initials = selectedEmployee?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="#10B981" stroke="white" stroke-width="3"/>
      <text x="22" y="27" text-anchor="middle" font-size="14" font-weight="800" font-family="system-ui,sans-serif" fill="white">${initials}</text>
    </svg>`;
    playbackMarkerRef.current = new window.google.maps.Marker({
      position: pathCoords[0],
      map: tripMapInstanceRef.current,
      zIndex: 10,
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(defaultSvg),
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22)
      }
    });
    if (selectedEmployee?.avatarUrl) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 44;
        canvas.height = 44;
        const ctx = canvas.getContext("2d");
        if (ctx && playbackMarkerRef.current) {
          ctx.beginPath();
          ctx.arc(22, 22, 22, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(22, 22, 20, 0, Math.PI * 2);
          ctx.fillStyle = "#10B981";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(22, 22, 17, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, 0, 0, 44, 44);
          playbackMarkerRef.current.setIcon({
            url: canvas.toDataURL("image/png"),
            scaledSize: new window.google.maps.Size(44, 44),
            anchor: new window.google.maps.Point(22, 22)
          });
        }
      };
      img.src = selectedEmployee.avatarUrl;
    }
    const bounds = new window.google.maps.LatLngBounds();
    pathCoords.forEach((c) => bounds.extend(c));
    tripMapInstanceRef.current.fitBounds(bounds);
  }, [points, summary.stops, view, selectedEmployee]);
  reactExports.useEffect(() => {
    if (!playbackMarkerRef.current || !points[replayIndex]) return;
    const p = points[replayIndex];
    playbackMarkerRef.current.setPosition({
      lat: p.latitude,
      lng: p.longitude
    });
    tripMapInstanceRef.current?.panTo({
      lat: p.latitude,
      lng: p.longitude
    });
  }, [replayIndex, points]);
  reactExports.useEffect(() => {
    if (!isReplaying || points.length < 2) return;
    const intervalMs = Math.max(20, 300 / replaySpeed);
    const step = replaySpeed > 4 ? Math.floor(replaySpeed / 2) : 1;
    const interval = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= points.length - 1) {
          setIsReplaying(false);
          return prev;
        }
        return Math.min(points.length - 1, prev + step);
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isReplaying, points, replaySpeed]);
  const placeMyLocationDot = reactExports.useCallback((mapInstance, lat, lng) => {
    if (!window.google) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="rgba(66,133,244,0.2)" stroke="none"/>
      <circle cx="10" cy="10" r="6" fill="#4285F4" stroke="white" stroke-width="2"/>
    </svg>`;
    const icon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: new window.google.maps.Point(10, 10)
    };
    if (!myLocationMarkerRef.current) {
      myLocationMarkerRef.current = new window.google.maps.Marker({
        position: {
          lat,
          lng
        },
        map: mapInstance,
        icon,
        title: "Your location",
        zIndex: 20
      });
    } else {
      myLocationMarkerRef.current.setPosition({
        lat,
        lng
      });
      myLocationMarkerRef.current.setMap(mapInstance);
    }
  }, []);
  const goToMyLocation = reactExports.useCallback((mapInstance) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const {
        latitude: lat,
        longitude: lng
      } = pos.coords;
      mapInstance.panTo({
        lat,
        lng
      });
      mapInstance.setZoom(16);
      placeMyLocationDot(mapInstance, lat, lng);
    }, () => alert("Unable to retrieve your location. Please allow location access."));
  }, [placeMyLocationDot]);
  reactExports.useEffect(() => {
    if (!mapLoaded || !fleetMapInstanceRef.current) return;
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition((pos) => placeMyLocationDot(fleetMapInstanceRef.current, pos.coords.latitude, pos.coords.longitude), () => {
    }, {
      enableHighAccuracy: true,
      maximumAge: 1e4
    });
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [mapLoaded, placeMyLocationDot]);
  reactExports.useEffect(() => {
    fetchEmployees();
    const channel = supabase.channel("map-live-locs").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "location_points"
    }, () => fetchEmployees()).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "live_locations"
    }, () => fetchEmployees()).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "tracking_status"
    }, () => fetchEmployees()).subscribe();
    const interval = setInterval(fetchEmployees, 3e4);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchEmployees]);
  reactExports.useEffect(() => {
    if (view === "fleet") fetchEmployees();
  }, [selectedDate]);
  reactExports.useEffect(() => {
    summary.stops.forEach((stop) => {
      if (!stopLandmarks[stop.id]) {
        reverseGeocode(stop.latitude, stop.longitude).then((addr) => {
          if (addr) setStopLandmarks((p) => ({
            ...p,
            [stop.id]: addr
          }));
        });
      }
    });
  }, [summary.stops]);
  const selectEmployee = reactExports.useCallback((userId) => {
    setSelectedUserId(userId);
    setView("trip");
    tripMapInstanceRef.current = null;
    fetchTrail(userId, selectedDate);
    Object.values(employeeInfoWindowsRef.current).forEach((iw) => iw.close());
  }, [selectedDate, fetchTrail]);
  const goBack = () => {
    setView("fleet");
    setSelectedUserId(null);
    setTrail([]);
    setIsReplaying(false);
    setTimeout(() => {
      if (fleetMapInstanceRef.current && window.google) {
        window.google.maps.event.trigger(fleetMapInstanceRef.current, "resize");
        const plotted = employees.filter((e) => e.latitude !== 0 || e.longitude !== 0);
        if (plotted.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          plotted.forEach((e) => bounds.extend({
            lat: e.latitude,
            lng: e.longitude
          }));
          fleetMapInstanceRef.current.fitBounds(bounds);
        } else if (plotted.length === 1) {
          fleetMapInstanceRef.current.setCenter({
            lat: plotted[0].latitude,
            lng: plotted[0].longitude
          });
          fleetMapInstanceRef.current.setZoom(15);
        }
      }
    }, 100);
  };
  const goBackDate = () => {
    const d = /* @__PURE__ */ new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() - 1);
    const nd = localDateStr(d);
    setSelectedDate(nd);
    if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, nd);
  };
  const goForwardDate = () => {
    const d = /* @__PURE__ */ new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const nd = localDateStr(d);
    if (nd <= todayStr()) {
      setSelectedDate(nd);
      if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, nd);
    }
  };
  const locateEmployee = (emp) => {
    if (!fleetMapInstanceRef.current || emp.latitude === 0) return;
    fleetMapInstanceRef.current.panTo({
      lat: emp.latitude,
      lng: emp.longitude
    });
    fleetMapInstanceRef.current.setZoom(16);
    setSheetExpanded(false);
    Object.values(employeeInfoWindowsRef.current).forEach((iw) => iw.close());
    if (employeeInfoWindowsRef.current[emp.userId] && employeeMarkersRef.current[emp.userId]) {
      employeeInfoWindowsRef.current[emp.userId].open(fleetMapInstanceRef.current, employeeMarkersRef.current[emp.userId]);
    }
  };
  const onlineCount = employees.filter((e) => isLive(e.recordedAt)).length;
  const lastHourCount = employees.filter((e) => isLastHour(e.recordedAt)).length;
  const rangeLabel = summary.firstAt && summary.lastAt ? `${formatTime(summary.firstAt)} – ${formatTime(summary.lastAt)} · ${formatDuration(summary.durationMs)}` : `${formatDateLabel(selectedDate)} · No data`;
  const progress = reactExports.useMemo(() => {
    if (points.length <= 1 || !summary.firstAt || !summary.lastAt) return 0;
    const first = new Date(summary.firstAt).getTime();
    const last = new Date(summary.lastAt).getTime();
    const cur = new Date(points[Math.min(replayIndex, points.length - 1)].recordedAt).getTime();
    return Math.max(0, Math.min(1, (cur - first) / Math.max(1, last - first)));
  }, [replayIndex, points, summary]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col h-full -mx-4 sm:-mx-6 -mt-2 relative ${view === "fleet" ? "" : "hidden"}`, style: {
      minHeight: "calc(100vh - 64px)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          fleetMapInstanceRef.current = null;
          setMapLoaded(false);
          setMapListMode("map");
        }, className: `px-6 py-2 text-sm font-semibold transition-colors ${mapListMode === "map" ? "bg-[#1E3A5F] text-white" : "text-gray-500"}`, children: "Map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          fleetMapInstanceRef.current = null;
          setMapLoaded(false);
          setMapListMode("list");
        }, className: `px-6 py-2 text-sm font-semibold transition-colors ${mapListMode === "list" ? "bg-[#1E3A5F] text-white" : "text-gray-500"}`, children: "List" })
      ] }),
      mapListMode === "map" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: fleetMapRef, className: "flex-1 w-full", style: {
          height: "100%"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 transition-all duration-300", style: {
          height: sheetExpanded ? 420 : 80
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full flex flex-col items-center pt-3 pb-2 gap-1", onClick: () => setSheetExpanded((v) => !v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 rounded-full bg-gray-300" }),
            !sheetExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-[#1E3A5F]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-gray-800 flex-1", children: [
                onlineCount,
                " Live · ",
                employees.filter((e) => e.latitude !== 0).length,
                " Located · ",
                employees.length,
                " Total"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-gray-400 -rotate-90" })
            ] })
          ] }),
          sheetExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100%-48px)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pb-3 border-b border-gray-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-gray-900", children: "Employees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
                  onlineCount,
                  " live"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSheetExpanded(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6 text-gray-500" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-2 space-y-2", children: employees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-gray-400 py-8 text-sm", children: "No employees found" }) : employees.map((emp) => {
              const online = isLive(emp.recordedAt);
              const initials = emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const landmark = landmarkCache[emp.userId];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-gray-50 rounded-xl p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                    emp.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: emp.avatarUrl, className: "w-10 h-10 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F] font-bold text-sm", children: initials }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-50 ${online ? "bg-green-500" : "bg-gray-400"}` })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-gray-900 text-sm truncate", children: emp.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: online ? "Live now" : `Last seen ${timeAgo(emp.recordedAt)}` }),
                    landmark && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 truncate", children: [
                      "📍 ",
                      landmark
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  emp.latitude !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => locateEmployee(emp), className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LocateFixed, { className: "w-3.5 h-3.5" }),
                    " Locate"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => selectEmployee(emp.userId), className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Map$1, { className: "w-3.5 h-3.5" }),
                    " View Path"
                  ] })
                ] })
              ] }, emp.userId);
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-1/3 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fleetMapInstanceRef.current?.setZoom((fleetMapInstanceRef.current.getZoom() ?? 12) + 1), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light", children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fleetMapInstanceRef.current?.setZoom((fleetMapInstanceRef.current.getZoom() ?? 12) - 1), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light", children: "−" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: fetchEmployees, className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200", title: "Refresh", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${loadingEmployees ? "animate-spin text-[#1E3A5F]" : "text-gray-700"}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fleetMapInstanceRef.current && goToMyLocation(fleetMapInstanceRef.current), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-[#4285F4]", title: "My location", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocateFixed, { className: "w-4 h-4" }) })
        ] })
      ] }) : (
        /* ── List mode ── */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-4 pt-16 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setActiveFilter(activeFilter === "Live now" ? "All" : "Live now"), className: `flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "Live now" ? "border-green-400" : "border-gray-100"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-green-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-gray-900", children: onlineCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Live" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setActiveFilter(activeFilter === "Last hour" ? "All" : "Last hour"), className: `flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "Last hour" ? "border-amber-400" : "border-gray-100"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-amber-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-gray-900", children: lastHourCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Recent" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setActiveFilter("All"), className: `flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "All" ? "border-blue-300" : "border-gray-100"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-[#1E3A5F]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-gray-900", children: employees.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Total" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-4 mb-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBackDate, className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center justify-center bg-white rounded-xl py-2 border border-gray-200 shadow-sm relative overflow-hidden group", children: [
              role !== "employee" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: selectedDate, max: todayStr(), onChange: (e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, e.target.value);
                }
              }, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10", title: "Select Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold text-gray-800 ${role !== "employee" ? "group-hover:text-[#1E3A5F] transition-colors" : ""}`, children: formatDateLabel(selectedDate) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goForwardDate, disabled: selectedDate >= todayStr(), className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-gray-600" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-gray-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search employees...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400" }),
            searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-gray-400" }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 px-4 mb-2 overflow-x-auto pb-1", children: ["All", "Live now", "Last hour", "Older"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveFilter(f), className: `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${activeFilter === f ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`, children: f }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide", children: [
            filteredEmployees.length,
            " employee",
            filteredEmployees.length !== 1 ? "s" : "",
            activeFilter !== "All" ? ` · ${activeFilter}` : "",
            searchQuery ? ` matching "${searchQuery}"` : ""
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 space-y-3 pb-4", children: loadingEmployees ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 text-gray-400 animate-spin" }) }) : filteredEmployees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-gray-300" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-sm", children: searchQuery ? `No employees match "${searchQuery}"` : `No ${activeFilter === "All" ? "" : activeFilter.toLowerCase() + " "}employees` })
          ] }) : filteredEmployees.map((emp) => {
            const online = isLive(emp.recordedAt);
            const recent = isLastHour(emp.recordedAt);
            const initials = emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const landmark = landmarkCache[emp.userId];
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl p-4 shadow-sm border border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                emp.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: emp.avatarUrl, className: "w-11 h-11 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold", children: initials }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${online ? "bg-green-500" : recent ? "bg-amber-400" : "bg-gray-400"}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900 truncate", children: emp.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${online ? "bg-green-50 text-green-600" : recent ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"}`, children: online ? "Live" : recent ? "Recent" : "Idle" })
                ] }),
                emp.designation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400 mt-0.5", children: emp.designation }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  new Date(emp.recordedAt).getFullYear() < 2e3 ? "Never seen" : `${timeAgo(emp.recordedAt)} · ${formatTime(emp.recordedAt)}`
                ] }),
                landmark ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: landmark })
                ] }) : emp.latitude !== 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3" }),
                  "Fetching address..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3" }),
                  "no location today"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#1E3A5F] font-medium flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3" }),
                    " Route replay ready"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => selectEmployee(emp.userId), className: "flex items-center gap-1.5 px-4 py-1.5 bg-[#1E3A5F] text-white rounded-xl text-xs font-semibold", children: "View Trip →" })
                ] })
              ] })
            ] }) }, emp.userId);
          }) })
        ] })
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col h-full -mx-4 sm:-mx-6 -mt-2 relative bg-gray-100 ${view === "trip" ? "" : "hidden"}`, style: {
      minHeight: "calc(100vh - 64px)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBack, className: "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5 text-gray-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
          selectedEmployee?.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedEmployee.avatarUrl, className: "w-8 h-8 rounded-full object-cover shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F] font-bold text-xs shrink-0", children: selectedEmployee?.name ? selectedEmployee.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-gray-900 text-base truncate", children: [
              "Trip for ",
              selectedEmployee?.name ?? "Employee"
            ] }),
            selectedDate === todayStr() && isLive(selectedEmployee?.recordedAt) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-red-500 font-semibold", children: "LIVE" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goBackDate, className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group flex items-center justify-center px-2 py-1 hover:bg-gray-50 rounded-md", children: [
            role !== "employee" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: selectedDate, max: todayStr(), onChange: (e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
                if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, e.target.value);
              }
            }, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10", title: "Select Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold text-gray-600 whitespace-nowrap ${role !== "employee" ? "group-hover:text-[#1E3A5F] transition-colors" : ""}`, children: formatDateLabel(selectedDate) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goForwardDate, disabled: selectedDate >= todayStr(), className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-gray-600" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 border border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-5 h-5 text-gray-600" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 top-[56px]", style: {
        bottom: sheetExpanded ? 360 : 210
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: tripMapRef, className: "w-full h-full" }),
        loadingTrail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-[#1E3A5F] animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Loading trip…" })
        ] }) }),
        !loadingTrail && points.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl px-6 py-5 shadow-lg text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8 text-gray-300 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-gray-700", children: "No trip data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-1", children: [
            "No location points for ",
            formatDateLabel(selectedDate)
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 flex bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden text-xs font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTileMode("map"), className: `px-3 py-1.5 ${tileMode === "map" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`, children: "Map" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTileMode("satellite"), className: `px-3 py-1.5 ${tileMode === "satellite" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`, children: "Satellite" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-1/3 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => tripMapInstanceRef.current?.setZoom((tripMapInstanceRef.current.getZoom() ?? 14) + 1), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light", children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => tripMapInstanceRef.current?.setZoom((tripMapInstanceRef.current.getZoom() ?? 14) - 1), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light", children: "−" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (!tripMapInstanceRef.current || points.length < 2) return;
            const b = new window.google.maps.LatLngBounds();
            points.forEach((p) => b.extend({
              lat: p.latitude,
              lng: p.longitude
            }));
            tripMapInstanceRef.current.fitBounds(b);
          }, className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200", title: "Fit to trail", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocateFixed, { className: "w-4 h-4 text-gray-700" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => tripMapInstanceRef.current && goToMyLocation(tripMapInstanceRef.current), className: "w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-[#4285F4]", title: "My location", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-4 h-4" }) })
        ] }),
        activePoint?.speedKmh != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 bg-[#1E3A5F] text-white rounded-2xl px-3 py-2 text-sm font-bold shadow-lg", children: [
          Math.round(activePoint.speedKmh),
          " km/h"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 transition-all duration-300 flex flex-col", style: {
        height: sheetExpanded ? 550 : 210
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex justify-center pt-3 pb-1", onClick: () => setSheetExpanded((v) => !v), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 rounded-full bg-gray-300" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-gray-800", children: rangeLabel }),
            isReplaying && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 mt-0.5", children: [
              "Playback: ",
              formatTime(activePoint?.recordedAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              if (points.length < 2) return;
              setReplayIndex(0);
              setIsReplaying(true);
              setSheetExpanded(false);
            }, className: "flex items-center gap-1.5 px-4 py-2 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 fill-white" }),
              " Replay"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSheetExpanded((v) => !v), className: "flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-3.5 h-3.5" }),
              " Details"
            ] })
          ] })
        ] }),
        points.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-1.5 bg-gray-200 rounded-full cursor-pointer", onClick: (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setReplayIndex(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (points.length - 1)));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[#1E3A5F] rounded-full", style: {
            width: `${progress * 100}%`
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1E3A5F] shadow-md border-2 border-white", style: {
            left: `calc(${progress * 100}% - 8px)`
          } }),
          isReplaying && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-0 top-3 text-xs text-gray-400 font-mono", children: [
            Math.round(progress * 100),
            "%"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 px-5 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-green-500 mb-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              "Travelled"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-gray-900", children: formatDistance(summary.totalDistanceM) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: formatDuration(summary.durationMs) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-amber-500 mb-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500" }),
              "Stops"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold text-gray-900", children: [
              summary.stops.length,
              " stops"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
              "M",
              summary.stops.length,
              " · S0 · L0 · O0"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-blue-400 mb-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Signal, { className: "w-3 h-3" }),
              "Gaps"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-gray-900", children: summary.gaps.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-400", children: summary.gaps.length > 0 ? formatDuration(summary.gaps.reduce((s, g) => s + g.durationMs, 0)) : "-" })
          ] })
        ] }),
        sheetExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 border-t border-gray-100 pt-3 flex-1 overflow-y-auto pb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 bg-gray-50 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[#1E3A5F]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-gray-800", children: [
                "Avg ",
                summary.avgSpeedKmh.toFixed(1),
                " km/h · Max ",
                summary.maxSpeedKmh.toFixed(1),
                " km/h"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400", children: [
                isReplaying ? "Replaying" : "Stopped",
                " · ",
                formatTime(activePoint?.recordedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsReplaying((v) => !v), className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isReplaying ? "bg-amber-100 text-amber-600" : "bg-[#1E3A5F]/10 text-[#1E3A5F]"}`, children: isReplaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 fill-current" }) })
          ] }),
          summary.stops.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-gray-900 mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-amber-500" }),
              "Trip Stops (",
              summary.stops.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative ml-2 space-y-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[5px] top-4 bottom-4 w-0.5 bg-[#1E3A5F]/20" }),
              summary.stops.map((stop, idx) => {
                const addr = stopLandmarks[stop.id] || "Fetching nearest landmark...";
                const endAt = new Date(new Date(stop.arrivedAt).getTime() + stop.durationMs).toISOString();
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-8 pb-6 last:pb-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[1px] top-1.5 w-[10px] h-[10px] rounded-full bg-[#1E3A5F] border-2 border-white shadow-sm z-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-gray-100 shadow-sm rounded-xl p-3 transition-transform hover:-translate-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-[#1E3A5F]", children: [
                        "Stop ",
                        idx + 1
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100", children: formatDuration(stop.durationMs) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-medium", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-gray-400" }),
                      formatTime(stop.arrivedAt),
                      " - ",
                      formatTime(endAt)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 mb-2 flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-snug line-clamp-2", children: addr })
                    ] })
                  ] })
                ] }, stop.id);
              })
            ] })
          ] })
        ] })
      ] }),
      isReplaying && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-[220px] left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-white rounded-full px-4 py-2 flex items-center gap-4 shadow-xl z-30 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setReplayIndex(0);
          setIsReplaying(true);
        }, className: "hover:text-blue-200 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsReplaying(false), className: "hover:text-blue-200 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5 text-xs font-bold", children: [1, 2, 4, 8].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReplaySpeed(s), className: `w-7 h-7 flex items-center justify-center rounded-full transition-colors ${replaySpeed === s ? "bg-white text-[#1E3A5F] shadow-sm" : "hover:bg-white/20"}`, children: [
          s,
          "x"
        ] }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold w-8 text-right tabular-nums", children: [
          Math.round(progress * 100),
          "%"
        ] })
      ] })
    ] })
  ] });
}
export {
  MapPage as component
};
