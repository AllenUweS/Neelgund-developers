import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  LocateFixed, Map as MapIcon, List, X, Play, Pause, SkipBack,
  ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw,
  Navigation, Clock, Zap, MapPin, Users, ArrowLeft, Search,
  Signal,
} from "lucide-react";

export const Route = createFileRoute("/_app/map")({
  head: () => ({ meta: [{ title: "Map — Neelgund Developers" }] }),
  component: MapPage,
});

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";

// ─── Types ─────────────────────────────────────────────────────────────────
interface EmployeeLocation {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  designation: string | null;
  latitude: number;
  longitude: number;
  /** Best available "last seen" time — prefers last_ping_at over recorded_at */
  recordedAt: string;
  trackerState: "running" | "stopped" | null;
}

interface LocationPoint {
  latitude: number;
  longitude: number;
  recordedAt: string;
  speedKmh?: number | null;
}

interface TripSummary {
  totalDistanceM: number;
  durationMs: number;
  stops: TripStop[];
  gaps: TripGap[];
  firstAt: string | null;
  lastAt: string | null;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  points: LocationPoint[];
}

interface TripStop {
  id: string;
  number: number;
  latitude: number;
  longitude: number;
  durationMs: number;
  arrivedAt: string;
}

interface TripGap {
  startAt: string;
  endAt: string;
  durationMs: number;
}

type FilterType = "All" | "Live now" | "Last hour" | "Older";

// ─── Helpers ───────────────────────────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 5-minute live threshold — same as mobile app
const LIVE_THRESHOLD_MS = 5 * 60 * 1000;

function isLive(iso: string | null | undefined): boolean {
  if (!iso) return false;
  return (Date.now() - new Date(iso).getTime()) <= LIVE_THRESHOLD_MS;
}

function isLastHour(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const diff = Date.now() - new Date(iso).getTime();
  return diff > LIVE_THRESHOLD_MS && diff < 60 * 60 * 1000;
}

function timeAgo(iso: string | null | undefined) {
  if (!iso || new Date(iso).getFullYear() < 2000) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "-";
  const mins = Math.round(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDistance(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(2)} KM`;
  return `${Math.round(m)} M`;
}

function formatTime(iso: string | null | undefined): string {
  if (!iso || new Date(iso).getFullYear() < 2000) return "-";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateLabel(date: string): string {
  if (date === todayStr()) return "Today";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** UTC bounds for a local YYYY-MM-DD string */
function getUtcBoundsForLocalDate(dateStr: string) {
  const startLocal = new Date(dateStr + "T00:00:00");
  const endLocal = new Date(dateStr + "T23:59:59.999");
  return {
    startUtcIso: startLocal.toISOString(),
    endUtcIso: endLocal.toISOString(),
  };
}

function deriveTripSummary(trail: LocationPoint[]): TripSummary {
  if (trail.length === 0) return { totalDistanceM: 0, durationMs: 0, stops: [], gaps: [], firstAt: null, lastAt: null, avgSpeedKmh: 0, maxSpeedKmh: 0, points: [] };
  const sorted = [...trail].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  let totalM = 0;
  let maxSpeed = 0;
  const movingSpeeds: number[] = [];
  const stops: TripStop[] = [];
  const gaps: TripGap[] = [];
  let stopNum = 0;
  
  const GAP_THRESHOLD_MS = 5 * 60 * 1000;
  const STOP_RADIUS_M = 50;
  const STOP_DURATION_MS = 5 * 60 * 1000;

  let stopStartIdx = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    
    // Distance and Max Speed
    const distM = haversineMeters(prev.latitude, prev.longitude, cur.latitude, cur.longitude);
    totalM += distM;
    const s = cur.speedKmh ?? 0;
    if (s > maxSpeed) maxSpeed = s;
    if (s > 2) movingSpeeds.push(s);

    // Gaps
    const timeDiff = new Date(cur.recordedAt).getTime() - new Date(prev.recordedAt).getTime();
    if (timeDiff > GAP_THRESHOLD_MS) {
      gaps.push({ startAt: prev.recordedAt, endAt: cur.recordedAt, durationMs: timeDiff });
    }

    // Stop Detection (Distance from stopStartIdx)
    const distFromStart = haversineMeters(
      sorted[stopStartIdx].latitude, 
      sorted[stopStartIdx].longitude, 
      cur.latitude, 
      cur.longitude
    );

    if (distFromStart > STOP_RADIUS_M) {
      // We moved outside the stop radius. Check if we were there long enough.
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
      // Reset stop start to current point
      stopStartIdx = i;
    }
  }

  // Check if trip ended while in a stop
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
  return { totalDistanceM: totalM, durationMs, stops, gaps, firstAt, lastAt, avgSpeedKmh: avgSpeed, maxSpeedKmh: maxSpeed, points: sorted };
}

// ─── Reverse geocoding (cached in memory) ──────────────────────────────────
const geoCache: Record<string, string> = {};
const geoPending = new Set<string>();

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!MAPS_API_KEY || lat === 0 && lng === 0) return null;
  const key = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
  if (geoCache[key]) return geoCache[key];
  if (geoPending.has(key)) return null;
  geoPending.add(key);
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address|locality&key=${MAPS_API_KEY}`
    );
    const data = await res.json();
    if (data.status === "OK" && data.results?.length) {
      const parts = (data.results[0].formatted_address as string).split(",").map((p: string) => p.trim()).filter(Boolean);
      const short = parts.slice(0, 3).join(", ");
      geoCache[key] = short;
      return short;
    }
  } catch { /* ignore */ } finally {
    geoPending.delete(key);
  }
  return null;
}

// ─── Google Maps helpers ────────────────────────────────────────────────────
declare global { interface Window { google: any; initGoogleMaps: () => void; } }

function buildEmployeeMarkerSvg(initials: string, online: boolean, photoUrl: string | null): string {
  const color = online ? "#1E3A5F" : "#94a3b8";
  if (photoUrl) {
    // Return a transparent SVG of the same size to act as a click target
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

function buildNumberedStopSvg(num: string, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="18" y="23" text-anchor="middle" font-size="13" font-weight="700" font-family="system-ui,sans-serif" fill="white">${num}</text>
  </svg>`;
}

// ─── Main component ──────────────────────────────────────────────────────────
function MapPage() {
  const { user, role } = useAuth();

  const [view, setView] = useState<"fleet" | "trip">("fleet");
  const [mapListMode, setMapListMode] = useState<"map" | "list">("map");
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [employees, setEmployees] = useState<EmployeeLocation[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [landmarkCache, setLandmarkCache] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [trail, setTrail] = useState<LocationPoint[]>([]);
  const [stopLandmarks, setStopLandmarks] = useState<Record<string, string>>({});
  const [loadingTrail, setLoadingTrail] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replaySpeed] = useState(1);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [tileMode, setTileMode] = useState<"map" | "satellite">("map");

  const myLocationMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const fleetMapRef = useRef<HTMLDivElement>(null);
  const tripMapRef = useRef<HTMLDivElement>(null);
  const fleetMapInstanceRef = useRef<any>(null);
  const tripMapInstanceRef = useRef<any>(null);
  const employeeMarkersRef = useRef<Record<string, any>>({});
  const employeeLabelsRef = useRef<Record<string, any>>({});
  const employeeInfoWindowsRef = useRef<Record<string, any>>({});
  const tripPolylineRef = useRef<any>(null);
  const tripMarkersRef = useRef<any[]>([]);
  const playbackMarkerRef = useRef<any>(null);

  const summary = useMemo(() => deriveTripSummary(trail), [trail]);
  const points = summary.points;
  const activePoint = points[Math.min(replayIndex, Math.max(points.length - 1, 0))] ?? null;
  const selectedEmployee = employees.find(e => e.userId === selectedUserId) ?? null;

  // ─── Filtered employees ──────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (activeFilter === "Live now") list = list.filter(e => isLive(e.recordedAt));
    else if (activeFilter === "Last hour") list = list.filter(e => isLastHour(e.recordedAt));
    else if (activeFilter === "Older") list = list.filter(e => !isLive(e.recordedAt) && !isLastHour(e.recordedAt));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.designation ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [employees, activeFilter, searchQuery]);

  // ─── Load Google Maps ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!MAPS_API_KEY) return;
    if (window.google?.maps) { setMapsReady(true); return; }
    const existing = document.getElementById("gm-script-map");
    if (existing) { existing.addEventListener("load", () => setMapsReady(true)); return; }
    window.initGoogleMaps = () => setMapsReady(true);
    const s = document.createElement("script");
    s.id = "gm-script-map";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initGoogleMaps`;
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, []);

  // ─── Init fleet map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapsReady || !fleetMapRef.current || fleetMapInstanceRef.current) return;
    if (view !== "fleet" || mapListMode !== "map") return;
    // Clear stale marker refs — the old map DOM is gone, markers can't be reused
    employeeMarkersRef.current = {};
    employeeLabelsRef.current = {};
    employeeInfoWindowsRef.current = {};
    if (myLocationMarkerRef.current) { myLocationMarkerRef.current = null; }
    fleetMapInstanceRef.current = new window.google.maps.Map(fleetMapRef.current, {
      center: { lat: 15.3597, lng: 75.1239 },
      zoom: 12,
      mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
      styles: [{ featureType: "poi", stylers: [{ visibility: "simplified" }] }],
    });
    setMapLoaded(true);
    // Re-draw markers after map reinit (markers were cleared above)
    setTimeout(() => setEmployees(prev => { updateFleetMarkers(prev); return prev; }), 400);
  }, [mapsReady, view, mapListMode]);

  // ─── Init trip map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapsReady || !tripMapRef.current || tripMapInstanceRef.current || view !== "trip") return;
    tripMapInstanceRef.current = new window.google.maps.Map(tripMapRef.current, {
      center: { lat: 15.3597, lng: 75.1239 },
      zoom: 14,
      mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
      mapTypeId: tileMode === "satellite" ? "satellite" : "roadmap",
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
    });
  }, [mapsReady, view]);

  useEffect(() => {
    if (!tripMapInstanceRef.current || !window.google) return;
    tripMapInstanceRef.current.setMapTypeId(tileMode === "satellite" ? "satellite" : "roadmap");
  }, [tileMode]);

  // ─── FIXED: Fetch employees the same way the mobile app does ─────────────
  // Mobile app uses THREE sources:
  //   1. profiles table  — ALL employees (even those with no location today)
  //   2. location_points — latest GPS point per employee for the selected date
  //   3. tracking_status — last_ping_at (heartbeat) + tracker_state (running/stopped)
  // The web app was only querying live_locations with a 3h cutoff, which
  // missed: employees with no movement today, employees whose last ping was >3h ago,
  // and the tracker running/stopped state that drives the "Live" badge.
  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const { startUtcIso, endUtcIso } = getUtcBoundsForLocalDate(selectedDate);

      // 1. Fetch profiles based on role
      let profileQuery = supabase.from("profiles").select("id, name, email, designation, profile_photo_url, role");
      if (role === "employee" && user?.id) {
        profileQuery = profileQuery.eq("id", user.id);
      }
      const { data: profileRows, error: profileErr } = await profileQuery;

      if (profileErr) {
        console.error("Error fetching profiles:", profileErr);
      }

      const allProfiles = new Map<string, any>();
      for (const p of profileRows ?? []) allProfiles.set(p.id, p);

      // Also include admins/managers who have location data (in case admin is tracking self)
      // We'll add them if they appear in location_points below.

      // 2. Fetch latest location point per employee for selected date
      //    Try location_points first, fall back to live_locations if empty
      let latestByEmployee = new Map<string, any>();

      const { data: locRows } = await supabase
        .from("location_points")
        .select("employee_id, latitude, longitude, recorded_at")
        .gte("recorded_at", startUtcIso)
        .lte("recorded_at", endUtcIso)
        .order("recorded_at", { ascending: false })
        .limit(100000);

      if (locRows && locRows.length > 0) {
        for (const row of locRows) {
          if (!latestByEmployee.has(row.employee_id)) latestByEmployee.set(row.employee_id, row);
        }
      } else {
        // Fallback: try live_locations table (older schema)
        const { data: liveRows } = await supabase
          .from("live_locations")
          .select("user_id, latitude, longitude, recorded_at")
          .gte("recorded_at", startUtcIso)
          .lte("recorded_at", endUtcIso)
          .order("recorded_at", { ascending: false })
          .limit(100000);

        for (const row of (liveRows ?? [])) {
          const empId = row.employee_id ?? row.user_id;
          if (!latestByEmployee.has(empId)) {
            latestByEmployee.set(empId, { employee_id: empId, latitude: row.latitude, longitude: row.longitude, recorded_at: row.recorded_at });
          }
        }
      }

      // 3. Fetch tracking_status for all profiles — gives us last_ping_at + tracker_state
      const allEmployeeIds = Array.from(allProfiles.keys());
      const trackerStateById = new Map<string, "running" | "stopped">();
      const lastPingAtById = new Map<string, string>();

      if (allEmployeeIds.length > 0) {
        // Try tracking_status table
        const { data: statusRows, error: statusErr } = await supabase
          .from("tracking_status")
          .select("employee_id, tracker_state, last_ping_at")
          .in("employee_id", allEmployeeIds);

        if (!statusErr && statusRows) {
          for (const row of statusRows) {
            if (row.tracker_state) trackerStateById.set(row.employee_id, row.tracker_state);
            if (row.last_ping_at) lastPingAtById.set(row.employee_id, row.last_ping_at);
          }
        }
      }

      // 4. Build enriched EmployeeLocation list
      const result: EmployeeLocation[] = [];

      // Employees WITH a location point today
      for (const [userId, locRow] of latestByEmployee) {
        const profile = allProfiles.get(userId);
        const lastPing = lastPingAtById.get(userId);
        const trackerState = trackerStateById.get(userId) ?? null;
        // Prefer last_ping_at if it is more recent than the GPS point
        const displayTime =
          lastPing && new Date(lastPing) > new Date(locRow.recorded_at)
            ? lastPing
            : locRow.recorded_at;

        result.push({
          userId,
          name: profile?.name || profile?.email || "Unknown",
          email: profile?.email || "",
          avatarUrl: profile?.profile_photo_url ?? null,
          designation: profile?.designation ?? null,
          latitude: locRow.latitude,
          longitude: locRow.longitude,
          recordedAt: displayTime,
          trackerState,
        });
      }

      // Employees WITH NO location point today — show as offline placeholders
      // so admin can see everyone, not just those who moved today
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
            recordedAt: lastPing ?? new Date(0).toISOString(),
            trackerState: trackerStateById.get(id) ?? "stopped",
          });
        }
      }

      // Sort: live first, then by most recent
      result.sort((a, b) => {
        const aLive = isLive(a.recordedAt) ? 1 : 0;
        const bLive = isLive(b.recordedAt) ? 1 : 0;
        if (aLive !== bLive) return bLive - aLive;
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      });

      setEmployees(result);
      updateFleetMarkers(result);

      // Kick off geocoding for employees who have a real location
      result.forEach(emp => {
        if (emp.latitude !== 0 || emp.longitude !== 0) {
          reverseGeocode(emp.latitude, emp.longitude).then(addr => {
            if (addr) setLandmarkCache(prev => ({ ...prev, [emp.userId]: addr }));
          });
        }
      });
    } finally {
      setLoadingEmployees(false);
    }
  }, [selectedDate, role, user?.id]);

  // ─── Fetch trail ─────────────────────────────────────────────────────────
  const fetchTrail = useCallback(async (userId: string, date: string) => {
    setLoadingTrail(true);
    setTrail([]);
    setReplayIndex(0);
    setIsReplaying(false);
    try {
      const { startUtcIso, endUtcIso } = getUtcBoundsForLocalDate(date);
      let pts: LocationPoint[] = [];

      // Try location_points first
      let lpData: any[] = [];
      let start = 0;
      const PAGE_SIZE = 1000;
      
      while (true) {
        const { data } = await supabase
          .from("location_points")
          .select("latitude, longitude, recorded_at, speed_kmh")
          .eq("employee_id", userId)
          .gte("recorded_at", startUtcIso)
          .lte("recorded_at", endUtcIso)
          .order("recorded_at", { ascending: true })
          .range(start, start + PAGE_SIZE - 1);
          
        if (!data || data.length === 0) break;
        lpData = lpData.concat(data);
        if (data.length < PAGE_SIZE) break;
        start += PAGE_SIZE;
      }

      if (lpData && lpData.length > 0) {
        pts = lpData.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude, recordedAt: p.recorded_at, speedKmh: p.speed_kmh ?? null }));
      } else {
        // Fallback to live_locations
        let llData: any[] = [];
        let startLl = 0;
        
        while (true) {
          const { data } = await supabase
            .from("live_locations")
            .select("latitude, longitude, recorded_at")
            .eq("user_id", userId)
            .gte("recorded_at", startUtcIso)
            .lte("recorded_at", endUtcIso)
            .order("recorded_at", { ascending: true })
            .range(startLl, startLl + PAGE_SIZE - 1);
            
          if (!data || data.length === 0) break;
          llData = llData.concat(data);
          if (data.length < PAGE_SIZE) break;
          startLl += PAGE_SIZE;
        }

        pts = (llData ?? []).map((p: any) => ({ latitude: p.latitude, longitude: p.longitude, recordedAt: p.recorded_at, speedKmh: null }));
      }

      // Compute speeds where missing
      for (let i = 1; i < pts.length; i++) {
        if (pts[i].speedKmh == null) {
          const distM = haversineMeters(pts[i - 1].latitude, pts[i - 1].longitude, pts[i].latitude, pts[i].longitude);
          const dtS = (new Date(pts[i].recordedAt).getTime() - new Date(pts[i - 1].recordedAt).getTime()) / 1000;
          pts[i].speedKmh = dtS > 0 ? (distM / dtS) * 3.6 : 0;
        }
      }
      setTrail(pts);
    } finally {
      setLoadingTrail(false);
    }
  }, []);

  // ─── Fleet markers with name labels + info windows ────────────────────────
  const updateFleetMarkers = useCallback((emps: EmployeeLocation[]) => {
    if (!fleetMapInstanceRef.current || !window.google) return;

    const currentIds = new Set(emps.map(e => e.userId));

    // Remove stale markers
    Object.keys(employeeMarkersRef.current).forEach(uid => {
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

    // Only plot employees with a real location (lat/lng != 0,0)
    const plotted = emps.filter(e => e.latitude !== 0 || e.longitude !== 0);

    plotted.forEach(emp => {
      const pos = { lat: emp.latitude, lng: emp.longitude };
      const online = isLive(emp.recordedAt);
      const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
      const svg = buildEmployeeMarkerSvg(initials, online, emp.avatarUrl);
      const icon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22),
      };

      const makeIwContent = (landmark?: string) => `
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
        // Update existing marker
        employeeMarkersRef.current[emp.userId].setPosition(pos);
        employeeMarkersRef.current[emp.userId].setIcon(icon);
        const lm = geoCache[`${emp.latitude.toFixed(4)}_${emp.longitude.toFixed(4)}`];
        if (employeeInfoWindowsRef.current[emp.userId]) {
          employeeInfoWindowsRef.current[emp.userId].setContent(makeIwContent(lm));
        }
        // Update label text and potentially avatar
        const label = employeeLabelsRef.current[emp.userId];
        if (label && (label as any)._nameLabel) {
          (label as any)._nameLabel.textContent = emp.name;
        }
      } else {
        // Create marker + floating name label + info window
        const infoWindow = new window.google.maps.InfoWindow({ content: makeIwContent() });

        const marker = new window.google.maps.Marker({ position: pos, map: fleetMapInstanceRef.current, icon, title: emp.name, zIndex: online ? 10 : 5 });

        // Name label overlay — handles both label and avatar image
        const labelOverlay = new window.google.maps.OverlayView();
        labelOverlay.onAdd = function () {
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

          (this as any)._container = container;
          (this as any)._nameLabel = nameLabel;
          this.getPanes()!.overlayLayer.appendChild(container);
        };
        labelOverlay.draw = function () {
          const proj = this.getProjection();
          if (!proj || !(this as any)._container) return;
          const pt = proj.fromLatLngToDivPixel(new window.google.maps.LatLng(emp.latitude, emp.longitude));
          if (!pt) return;
          const container = (this as any)._container as HTMLDivElement;

          container.style.left = (pt.x - container.offsetWidth / 2) + "px";
          // If avatar is present, the center of the avatar is at the pin center (pt.y).
          // Container height = label height + 6px gap + 44px avatar.
          // We shift up by (containerHeight - 22) so the avatar's center aligns with pt.y.
          // If no avatar, just the label, which was at pt.y - 52 previously.
          if (emp.avatarUrl) {
            container.style.top = (pt.y - container.offsetHeight + 22) + "px";
          } else {
            container.style.top = (pt.y - 52) + "px";
          }
        };
        labelOverlay.onRemove = function () {
          if ((this as any)._container?.parentNode) {
            (this as any)._container.parentNode.removeChild((this as any)._container);
          }
        };
        labelOverlay.setMap(fleetMapInstanceRef.current);

        marker.addListener("click", () => {
          Object.values(employeeInfoWindowsRef.current).forEach(iw => iw.close());
          infoWindow.open(fleetMapInstanceRef.current, marker);
        });

        employeeMarkersRef.current[emp.userId] = marker;
        employeeLabelsRef.current[emp.userId] = labelOverlay;
        employeeInfoWindowsRef.current[emp.userId] = infoWindow;
      }
    });

    // Fit bounds
    if (plotted.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      plotted.forEach(e => bounds.extend({ lat: e.latitude, lng: e.longitude }));
      fleetMapInstanceRef.current.fitBounds(bounds);
    } else if (plotted.length === 1) {
      fleetMapInstanceRef.current.setCenter({ lat: plotted[0].latitude, lng: plotted[0].longitude });
      fleetMapInstanceRef.current.setZoom(15);
    }
  }, []);

  // Expose callbacks for info window buttons
  useEffect(() => {
    (window as any).__mapLocate = (userId: string) => {
      const emp = employees.find(e => e.userId === userId);
      if (emp && fleetMapInstanceRef.current) {
        fleetMapInstanceRef.current.panTo({ lat: emp.latitude, lng: emp.longitude });
        fleetMapInstanceRef.current.setZoom(16);
        Object.values(employeeInfoWindowsRef.current).forEach(iw => iw.close());
      }
    };
    (window as any).__mapViewTrip = (userId: string) => selectEmployee(userId);
  }, [employees]);

  // Update info windows when geocoding resolves
  useEffect(() => {
    if (!fleetMapInstanceRef.current || !window.google) return;
    employees.forEach(emp => {
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

  // ─── Draw trip polyline ───────────────────────────────────────────────────
  useEffect(() => {
    if (!tripMapInstanceRef.current || !window.google || view !== "trip") return;
    if (tripPolylineRef.current) { tripPolylineRef.current.setMap(null); tripPolylineRef.current = null; }
    tripMarkersRef.current.forEach(m => m.setMap(null));
    tripMarkersRef.current = [];
    if (playbackMarkerRef.current) { playbackMarkerRef.current.setMap(null); playbackMarkerRef.current = null; }
    if (points.length < 2) return;

    const pathCoords = points.map(p => ({ lat: p.latitude, lng: p.longitude }));
    tripPolylineRef.current = new window.google.maps.Polyline({
      path: pathCoords, geodesic: true, strokeColor: "#1E3A5F", strokeOpacity: 0.9, strokeWeight: 4,
      map: tripMapInstanceRef.current,
    });
    const addPin = (pos: any, num: string, color: string, zIndex = 4) => {
      const svg = buildNumberedStopSvg(num, color);
      tripMarkersRef.current.push(new window.google.maps.Marker({
        position: pos, map: tripMapInstanceRef.current, zIndex,
        icon: { url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg), scaledSize: new window.google.maps.Size(36, 36), anchor: new window.google.maps.Point(18, 18) },
      }));
    };
    addPin(pathCoords[0], "S", "#10B981", 5);
    addPin(pathCoords[pathCoords.length - 1], "E", "#EF4444", 5);
    summary.stops.forEach(stop => addPin({ lat: stop.latitude, lng: stop.longitude }, String(stop.number), "#F59E0B"));

    const initials = selectedEmployee?.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";
    const markerSvg = buildEmployeeMarkerSvg(initials, true, selectedEmployee?.avatarUrl ?? null);
    playbackMarkerRef.current = new window.google.maps.Marker({
      position: pathCoords[0], map: tripMapInstanceRef.current, zIndex: 10,
      icon: { url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(markerSvg), scaledSize: new window.google.maps.Size(44, 44), anchor: new window.google.maps.Point(22, 22) },
    });
    const bounds = new window.google.maps.LatLngBounds();
    pathCoords.forEach(c => bounds.extend(c));
    tripMapInstanceRef.current.fitBounds(bounds);
  }, [points, summary.stops, view]);

  // Update playback marker position
  useEffect(() => {
    if (!playbackMarkerRef.current || !points[replayIndex]) return;
    const p = points[replayIndex];
    playbackMarkerRef.current.setPosition({ lat: p.latitude, lng: p.longitude });
    tripMapInstanceRef.current?.panTo({ lat: p.latitude, lng: p.longitude });
  }, [replayIndex, points]);

  // Replay animation
  useEffect(() => {
    if (!isReplaying || points.length < 2) return;
    const interval = setInterval(() => {
      setReplayIndex(prev => {
        if (prev >= points.length - 1) { setIsReplaying(false); return prev; }
        return prev + 1;
      });
    }, Math.max(100, 500 / replaySpeed));
    return () => clearInterval(interval);
  }, [isReplaying, points, replaySpeed]);

  // ─── My Location ──────────────────────────────────────────────────────────
  const placeMyLocationDot = useCallback((mapInstance: any, lat: number, lng: number) => {
    if (!window.google) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="rgba(66,133,244,0.2)" stroke="none"/>
      <circle cx="10" cy="10" r="6" fill="#4285F4" stroke="white" stroke-width="2"/>
    </svg>`;
    const icon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: new window.google.maps.Point(10, 10),
    };
    if (!myLocationMarkerRef.current) {
      myLocationMarkerRef.current = new window.google.maps.Marker({ position: { lat, lng }, map: mapInstance, icon, title: "Your location", zIndex: 20 });
    } else {
      myLocationMarkerRef.current.setPosition({ lat, lng });
      myLocationMarkerRef.current.setMap(mapInstance);
    }
  }, []);

  const goToMyLocation = useCallback((mapInstance: any) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      mapInstance.panTo({ lat, lng });
      mapInstance.setZoom(16);
      placeMyLocationDot(mapInstance, lat, lng);
    }, () => alert("Unable to retrieve your location. Please allow location access."));
  }, [placeMyLocationDot]);

  // Watch position on fleet map
  useEffect(() => {
    if (!mapLoaded || !fleetMapInstanceRef.current) return;
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => placeMyLocationDot(fleetMapInstanceRef.current, pos.coords.latitude, pos.coords.longitude),
      () => { }, { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [mapLoaded, placeMyLocationDot]);

  // ─── Realtime subscription ────────────────────────────────────────────────
  useEffect(() => {
    fetchEmployees();
    const channel = supabase.channel("map-live-locs")
      .on("postgres_changes", { event: "*", schema: "public", table: "location_points" }, () => fetchEmployees())
      .on("postgres_changes", { event: "*", schema: "public", table: "live_locations" }, () => fetchEmployees())
      .on("postgres_changes", { event: "*", schema: "public", table: "tracking_status" }, () => fetchEmployees())
      .subscribe();
    const interval = setInterval(fetchEmployees, 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [fetchEmployees]);

  // Re-fetch when date changes in list mode
  useEffect(() => {
    if (view === "fleet") fetchEmployees();
  }, [selectedDate]);

  // Geocode derived stops that lack an address
  useEffect(() => {
    summary.stops.forEach(stop => {
      if (!stopLandmarks[stop.id]) {
        reverseGeocode(stop.latitude, stop.longitude).then(addr => {
          if (addr) setStopLandmarks(p => ({ ...p, [stop.id]: addr }));
        });
      }
    });
  }, [summary.stops]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const selectEmployee = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setView("trip");
    tripMapInstanceRef.current = null;
    fetchTrail(userId, selectedDate);
    Object.values(employeeInfoWindowsRef.current).forEach(iw => iw.close());
  }, [selectedDate, fetchTrail]);

  const goBack = () => {
    setView("fleet");
    setSelectedUserId(null);
    setTrail([]);
    setIsReplaying(false);

    // Google Maps needs a resize event if the container was hidden
    setTimeout(() => {
      if (fleetMapInstanceRef.current && window.google) {
        window.google.maps.event.trigger(fleetMapInstanceRef.current, "resize");
        // Also re-center if we have plotted employees
        const plotted = employees.filter(e => e.latitude !== 0 || e.longitude !== 0);
        if (plotted.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          plotted.forEach(e => bounds.extend({ lat: e.latitude, lng: e.longitude }));
          fleetMapInstanceRef.current.fitBounds(bounds);
        } else if (plotted.length === 1) {
          fleetMapInstanceRef.current.setCenter({ lat: plotted[0].latitude, lng: plotted[0].longitude });
          fleetMapInstanceRef.current.setZoom(15);
        }
      }
    }, 100);
  };

  const goBackDate = () => {
    const d = new Date(selectedDate + "T00:00:00"); d.setDate(d.getDate() - 1);
    const nd = localDateStr(d); setSelectedDate(nd);
    if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, nd);
  };
  const goForwardDate = () => {
    const d = new Date(selectedDate + "T00:00:00"); d.setDate(d.getDate() + 1);
    const nd = localDateStr(d);
    if (nd <= todayStr()) { setSelectedDate(nd); if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, nd); }
  };

  const locateEmployee = (emp: EmployeeLocation) => {
    if (!fleetMapInstanceRef.current || emp.latitude === 0) return;
    fleetMapInstanceRef.current.panTo({ lat: emp.latitude, lng: emp.longitude });
    fleetMapInstanceRef.current.setZoom(16);
    setSheetExpanded(false);
    Object.values(employeeInfoWindowsRef.current).forEach(iw => iw.close());
    if (employeeInfoWindowsRef.current[emp.userId] && employeeMarkersRef.current[emp.userId]) {
      employeeInfoWindowsRef.current[emp.userId].open(fleetMapInstanceRef.current, employeeMarkersRef.current[emp.userId]);
    }
  };

  const onlineCount = employees.filter(e => isLive(e.recordedAt)).length;
  const lastHourCount = employees.filter(e => isLastHour(e.recordedAt)).length;

  const rangeLabel = summary.firstAt && summary.lastAt
    ? `${formatTime(summary.firstAt)} – ${formatTime(summary.lastAt)} · ${formatDuration(summary.durationMs)}`
    : `${formatDateLabel(selectedDate)} · No data`;

  const progress = useMemo(() => {
    if (points.length <= 1 || !summary.firstAt || !summary.lastAt) return 0;
    const first = new Date(summary.firstAt).getTime();
    const last = new Date(summary.lastAt).getTime();
    const cur = new Date(points[Math.min(replayIndex, points.length - 1)].recordedAt).getTime();
    return Math.max(0, Math.min(1, (cur - first) / Math.max(1, last - first)));
  }, [replayIndex, points, summary]);

  if (!MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center"><MapPin className="w-8 h-8 text-[#1E3A5F]" /></div>
        <h3 className="font-semibold text-lg">Google Maps API key required</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Add <code className="px-1.5 py-0.5 rounded bg-muted">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="px-1.5 py-0.5 rounded bg-muted">.env</code> file and restart.
        </p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ─── Fleet View ─────────────────────────────────────────────────────────── */}
      <div className={`flex flex-col h-full -mx-4 sm:-mx-6 -mt-2 relative ${view === "fleet" ? "" : "hidden"}`} style={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Map/List toggle */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
          <button onClick={() => { fleetMapInstanceRef.current = null; setMapLoaded(false); setMapListMode("map"); }} className={`px-6 py-2 text-sm font-semibold transition-colors ${mapListMode === "map" ? "bg-[#1E3A5F] text-white" : "text-gray-500"}`}>Map</button>
          <button onClick={() => { fleetMapInstanceRef.current = null; setMapLoaded(false); setMapListMode("list"); }} className={`px-6 py-2 text-sm font-semibold transition-colors ${mapListMode === "list" ? "bg-[#1E3A5F] text-white" : "text-gray-500"}`}>List</button>
        </div>

        {mapListMode === "map" ? (
          <>
            <div ref={fleetMapRef} className="flex-1 w-full" style={{ height: "100%" }} />

            {/* Bottom sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 transition-all duration-300" style={{ height: sheetExpanded ? 420 : 80 }}>
              <button className="w-full flex flex-col items-center pt-3 pb-2 gap-1" onClick={() => setSheetExpanded(v => !v)}>
                <div className="w-10 h-1 rounded-full bg-gray-300" />
                {!sheetExpanded && (
                  <div className="flex items-center gap-2 px-4 w-full">
                    <Users className="w-5 h-5 text-[#1E3A5F]" />
                    <span className="text-sm font-semibold text-gray-800 flex-1">{onlineCount} Live · {employees.filter(e => e.latitude !== 0).length} Located · {employees.length} Total</span>
                    <ChevronLeft className="w-5 h-5 text-gray-400 -rotate-90" />
                  </div>
                )}
              </button>

              {sheetExpanded && (
                <div className="flex flex-col h-[calc(100%-48px)]">
                  <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Employees</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{onlineCount} live</span>
                      <button onClick={() => setSheetExpanded(false)}><X className="w-6 h-6 text-gray-500" /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                    {employees.length === 0
                      ? <div className="text-center text-gray-400 py-8 text-sm">No employees found</div>
                      : employees.map(emp => {
                        const online = isLive(emp.recordedAt);
                        const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                        const landmark = landmarkCache[emp.userId];
                        return (
                          <div key={emp.userId} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="relative shrink-0">
                                {emp.avatarUrl
                                  ? <img src={emp.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
                                  : <div className="w-10 h-10 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F] font-bold text-sm">{initials}</div>}
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-50 ${online ? "bg-green-500" : "bg-gray-400"}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900 text-sm truncate">{emp.name}</div>
                                <div className="text-xs text-gray-500">{online ? "Live now" : `Last seen ${timeAgo(emp.recordedAt)}`}</div>
                                {landmark && <div className="text-xs text-gray-400 truncate">📍 {landmark}</div>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {emp.latitude !== 0 && (
                                <button onClick={() => locateEmployee(emp)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-semibold">
                                  <LocateFixed className="w-3.5 h-3.5" /> Locate
                                </button>
                              )}
                              <button onClick={() => selectEmployee(emp.userId)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A5F] text-white text-xs font-semibold">
                                <MapIcon className="w-3.5 h-3.5" /> View Path
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Map controls */}
            <div className="absolute right-3 top-1/3 flex flex-col gap-2">
              <button onClick={() => fleetMapInstanceRef.current?.setZoom((fleetMapInstanceRef.current.getZoom() ?? 12) + 1)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light">+</button>
              <button onClick={() => fleetMapInstanceRef.current?.setZoom((fleetMapInstanceRef.current.getZoom() ?? 12) - 1)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light">−</button>
              <button onClick={fetchEmployees} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200" title="Refresh">
                <RefreshCw className={`w-4 h-4 ${loadingEmployees ? "animate-spin text-[#1E3A5F]" : "text-gray-700"}`} />
              </button>
              <button onClick={() => fleetMapInstanceRef.current && goToMyLocation(fleetMapInstanceRef.current)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-[#4285F4]" title="My location">
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* ── List mode ── */
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
            {/* Stats cards — clickable as filter shortcuts */}
            <div className="flex gap-3 px-4 pt-16 pb-3">
              <div onClick={() => setActiveFilter(activeFilter === "Live now" ? "All" : "Live now")} className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "Live now" ? "border-green-400" : "border-gray-100"}`}>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                <div><div className="text-xl font-bold text-gray-900">{onlineCount}</div><div className="text-xs text-gray-500">Live</div></div>
              </div>
              <div onClick={() => setActiveFilter(activeFilter === "Last hour" ? "All" : "Last hour")} className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "Last hour" ? "border-amber-400" : "border-gray-100"}`}>
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-500" /></div>
                <div><div className="text-xl font-bold text-gray-900">{lastHourCount}</div><div className="text-xs text-gray-500">Recent</div></div>
              </div>
              <div onClick={() => setActiveFilter("All")} className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border-2 flex items-center gap-3 cursor-pointer transition-colors ${activeFilter === "All" ? "border-blue-300" : "border-gray-100"}`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Users className="w-4 h-4 text-[#1E3A5F]" /></div>
                <div><div className="text-xl font-bold text-gray-900">{employees.length}</div><div className="text-xs text-gray-500">Total</div></div>
              </div>
            </div>

            {/* Date nav */}
            <div className="flex items-center px-4 mb-2 gap-2">
              <button onClick={goBackDate} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
              <div className="flex-1 flex items-center justify-center bg-white rounded-xl py-2 border border-gray-200 shadow-sm relative overflow-hidden group">
                {role !== "employee" && (
                  <input
                    type="date"
                    value={selectedDate}
                    max={todayStr()}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, e.target.value);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Select Date"
                  />
                )}
                <span className={`text-sm font-semibold text-gray-800 ${role !== "employee" ? "group-hover:text-[#1E3A5F] transition-colors" : ""}`}>{formatDateLabel(selectedDate)}</span>
              </div>
              <button onClick={goForwardDate} disabled={selectedDate >= todayStr()} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
            </div>

            {/* Search */}
            <div className="px-4 mb-2">
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input type="text" placeholder="Search employees..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400" />
                {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-4 h-4 text-gray-400" /></button>}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 px-4 mb-2 overflow-x-auto pb-1">
              {(["All", "Live now", "Last hour", "Older"] as FilterType[]).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${activeFilter === f ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="px-4 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""}{activeFilter !== "All" ? ` · ${activeFilter}` : ""}{searchQuery ? ` matching "${searchQuery}"` : ""}
              </span>
            </div>

            {/* Employee list */}
            <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-12"><RefreshCw className="w-5 h-5 text-gray-400 animate-spin" /></div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3"><Users className="w-6 h-6 text-gray-300" /></div>
                  <div className="text-gray-400 text-sm">{searchQuery ? `No employees match "${searchQuery}"` : `No ${activeFilter === "All" ? "" : activeFilter.toLowerCase() + " "}employees`}</div>
                </div>
              ) : filteredEmployees.map(emp => {
                const online = isLive(emp.recordedAt);
                const recent = isLastHour(emp.recordedAt);
                const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                const landmark = landmarkCache[emp.userId];
                return (
                  <div key={emp.userId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        {emp.avatarUrl
                          ? <img src={emp.avatarUrl} className="w-11 h-11 rounded-full object-cover" />
                          : <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">{initials}</div>}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${online ? "bg-green-500" : recent ? "bg-amber-400" : "bg-gray-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 truncate">{emp.name}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${online ? "bg-green-50 text-green-600" : recent ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"}`}>
                            {online ? "Live" : recent ? "Recent" : "Idle"}
                          </span>
                        </div>
                        {emp.designation && <div className="text-xs text-gray-400 mt-0.5">{emp.designation}</div>}
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(emp.recordedAt).getFullYear() < 2000 ? "Never seen" : `${timeAgo(emp.recordedAt)} · ${formatTime(emp.recordedAt)}`}
                        </div>
                        {landmark
                          ? <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{landmark}</span></div>
                          : emp.latitude !== 0
                            ? <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Navigation className="w-3 h-3" />Fetching address...</div>
                            : <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Navigation className="w-3 h-3" />no location today</div>}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-[#1E3A5F] font-medium flex items-center gap-1"><Navigation className="w-3 h-3" /> Route replay ready</span>
                          <button onClick={() => selectEmployee(emp.userId)} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1E3A5F] text-white rounded-xl text-xs font-semibold">View Trip →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Trip View ──────────────────────────────────────────────────────────── */}
      <div className={`flex flex-col h-full -mx-4 sm:-mx-6 -mt-2 relative bg-gray-100 ${view === "trip" ? "" : "hidden"}`} style={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedEmployee?.avatarUrl
              ? <img src={selectedEmployee.avatarUrl} className="w-8 h-8 rounded-full object-cover shrink-0" />
              : <div className="w-8 h-8 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F] font-bold text-xs shrink-0">{selectedEmployee?.name ? selectedEmployee.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?"}</div>}
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-base truncate">Trip for {selectedEmployee?.name ?? "Employee"}</div>
              {selectedDate === todayStr() && isLive(selectedEmployee?.recordedAt) && (
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-xs text-red-500 font-semibold">LIVE</span></div>
              )}
            </div>
          </div>
          {/* Date nav in header */}
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={goBackDate} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
            <div className="relative group flex items-center justify-center px-2 py-1 hover:bg-gray-50 rounded-md">
              {role !== "employee" && (
                <input
                  type="date"
                  value={selectedDate}
                  max={todayStr()}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedDate(e.target.value);
                      if (view === "trip" && selectedUserId) fetchTrail(selectedUserId, e.target.value);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Select Date"
                />
              )}
              <span className={`text-xs font-semibold text-gray-600 whitespace-nowrap ${role !== "employee" ? "group-hover:text-[#1E3A5F] transition-colors" : ""}`}>{formatDateLabel(selectedDate)}</span>
            </div>
            <button onClick={goForwardDate} disabled={selectedDate >= todayStr()} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 border border-gray-200"><MoreHorizontal className="w-5 h-5 text-gray-600" /></button>
        </div>

        {/* Map */}
        <div className="absolute inset-0 top-[56px]" style={{ bottom: sheetExpanded ? 360 : 210 }}>
          <div ref={tripMapRef} className="w-full h-full" />

          {loadingTrail && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-md">
                <RefreshCw className="w-4 h-4 text-[#1E3A5F] animate-spin" />
                <span className="text-sm font-medium text-gray-700">Loading trip…</span>
              </div>
            </div>
          )}

          {!loadingTrail && points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-5 shadow-lg text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-700">No trip data</div>
                <div className="text-xs text-gray-400 mt-1">No location points for {formatDateLabel(selectedDate)}</div>
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden text-xs font-semibold">
            <button onClick={() => setTileMode("map")} className={`px-3 py-1.5 ${tileMode === "map" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}>Map</button>
            <button onClick={() => setTileMode("satellite")} className={`px-3 py-1.5 ${tileMode === "satellite" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}>Satellite</button>
          </div>

          <div className="absolute right-3 top-1/3 flex flex-col gap-2">
            <button onClick={() => tripMapInstanceRef.current?.setZoom((tripMapInstanceRef.current.getZoom() ?? 14) + 1)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light">+</button>
            <button onClick={() => tripMapInstanceRef.current?.setZoom((tripMapInstanceRef.current.getZoom() ?? 14) - 1)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-xl font-light">−</button>
            <button onClick={() => { if (!tripMapInstanceRef.current || points.length < 2) return; const b = new window.google.maps.LatLngBounds(); points.forEach(p => b.extend({ lat: p.latitude, lng: p.longitude })); tripMapInstanceRef.current.fitBounds(b); }} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200" title="Fit to trail"><LocateFixed className="w-4 h-4 text-gray-700" /></button>
            <button onClick={() => tripMapInstanceRef.current && goToMyLocation(tripMapInstanceRef.current)} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 text-[#4285F4]" title="My location"><Navigation className="w-4 h-4" /></button>
          </div>

          {activePoint?.speedKmh != null && (
            <div className="absolute top-3 left-3 bg-[#1E3A5F] text-white rounded-2xl px-3 py-2 text-sm font-bold shadow-lg">
              {Math.round(activePoint.speedKmh)} km/h
            </div>
          )}
        </div>

        {/* Bottom sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 transition-all duration-300 flex flex-col" style={{ height: sheetExpanded ? 550 : 210 }}>
          <button className="w-full flex justify-center pt-3 pb-1" onClick={() => setSheetExpanded(v => !v)}>
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </button>

          <div className="flex items-center justify-between px-5 pb-3">
            <div>
              <div className="text-sm font-semibold text-gray-800">{rangeLabel}</div>
              {isReplaying && <div className="text-xs text-gray-400 mt-0.5">Playback: {formatTime(activePoint?.recordedAt)}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { if (points.length < 2) return; setReplayIndex(0); setIsReplaying(true); setSheetExpanded(false); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A5F] text-white rounded-xl text-sm font-semibold">
                <Play className="w-3.5 h-3.5 fill-white" /> Replay
              </button>
              <button onClick={() => setSheetExpanded(v => !v)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">
                <List className="w-3.5 h-3.5" /> Details
              </button>
            </div>
          </div>

          {points.length > 1 && (
            <div className="px-5 mb-3">
              <div className="relative h-1.5 bg-gray-200 rounded-full cursor-pointer" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setReplayIndex(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (points.length - 1))); }}>
                <div className="h-full bg-[#1E3A5F] rounded-full" style={{ width: `${progress * 100}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1E3A5F] shadow-md border-2 border-white" style={{ left: `calc(${progress * 100}% - 8px)` }} />
                {isReplaying && <span className="absolute right-0 top-3 text-xs text-gray-400 font-mono">{Math.round(progress * 100)}%</span>}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-4 px-5 pb-3">
            <div className="flex-1">
              <div className="text-xs font-medium text-green-500 mb-0.5 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />Travelled</div>
              <div className="text-lg font-bold text-gray-900">{formatDistance(summary.totalDistanceM)}</div>
              <div className="text-xs text-gray-400">{formatDuration(summary.durationMs)}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-amber-500 mb-0.5 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" />Stops</div>
              <div className="text-lg font-bold text-gray-900">{summary.stops.length} stops</div>
              <div className="text-xs text-gray-400">M{summary.stops.length} · S0 · L0 · O0</div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-400 mb-0.5 flex items-center gap-1"><Signal className="w-3 h-3" />Gaps</div>
              <div className="text-lg font-bold text-gray-900">{summary.gaps.length}</div>
              <div className="text-xs text-gray-400">{summary.gaps.length > 0 ? formatDuration(summary.gaps.reduce((s, g) => s + g.durationMs, 0)) : "-"}</div>
            </div>
          </div>

          {sheetExpanded && (
            <div className="px-5 border-t border-gray-100 pt-3 flex-1 overflow-y-auto pb-6">
              <div className="flex items-center gap-3 mb-3 bg-gray-50 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center shrink-0"><Zap className="w-4 h-4 text-[#1E3A5F]" /></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">Avg {summary.avgSpeedKmh.toFixed(1)} km/h · Max {summary.maxSpeedKmh.toFixed(1)} km/h</div>
                  <div className="text-xs text-gray-400">{isReplaying ? "Replaying" : "Stopped"} · {formatTime(activePoint?.recordedAt)}</div>
                </div>
                <button onClick={() => setIsReplaying(v => !v)} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isReplaying ? "bg-amber-100 text-amber-600" : "bg-[#1E3A5F]/10 text-[#1E3A5F]"}`}>
                  {isReplaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
              </div>

              {summary.stops.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Trip Stops ({summary.stops.length})
                  </h4>

                  {/* Timeline Container */}
                  <div className="relative ml-2 space-y-0">
                    {/* The continuous vertical line */}
                    <div className="absolute left-[5px] top-4 bottom-4 w-0.5 bg-[#1E3A5F]/20" />

                    {summary.stops.map((stop, idx) => {
                      const addr = stopLandmarks[stop.id] || "Fetching nearest landmark...";
                      // Calculate if there's an end time for display (duration added to start)
                      const endAt = new Date(new Date(stop.arrivedAt).getTime() + stop.durationMs).toISOString();

                      return (
                        <div key={stop.id} className="relative pl-8 pb-6 last:pb-0">
                          {/* Dot on the timeline */}
                          <div className="absolute left-[1px] top-1.5 w-[10px] h-[10px] rounded-full bg-[#1E3A5F] border-2 border-white shadow-sm z-10" />

                          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-3 transition-transform hover:-translate-y-0.5">
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="font-bold text-sm text-[#1E3A5F]">Stop {idx + 1}</span>
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                {formatDuration(stop.durationMs)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {formatTime(stop.arrivedAt)} - {formatTime(endAt)}
                            </div>
                            <div className="text-xs text-gray-600 mb-2 flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                              <span className="leading-snug line-clamp-2">{addr}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Replay mini bar */}
        {isReplaying && (
          <div className="absolute bottom-[220px] left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-xl z-30">
            <button onClick={() => { setReplayIndex(0); setIsReplaying(true); }}><SkipBack className="w-4 h-4" /></button>
            <button onClick={() => setIsReplaying(false)}><Pause className="w-4 h-4" /></button>
            <span className="text-xs font-semibold">{Math.round(progress * 100)}%</span>
          </div>
        )}
      </div>
    </>
  );
}