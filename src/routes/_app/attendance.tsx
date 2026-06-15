import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LogIn, LogOut, Clock, CheckCircle2, XCircle, AlertCircle, Users, Timer, Play, Pause, ChevronLeft, ChevronRight, Download, CalendarDays, LayoutGrid } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MonthlyView } from "@/components/attendance/MonthlyView";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Neelgund Developers" }] }),
  component: AttendancePage,
});

function fmt(iso: string) { return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }); }

// Calculate distance in meters using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Format duration in hours and minutes
function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Custom 12-hour time picker component
function TimePicker12({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [h, m] = value.split(":");
  const hour24 = parseInt(h, 10);
  const isPm = hour24 >= 12;
  const hour12 = hour24 % 12 || 12;
  
  const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let newH = parseInt(e.target.value, 10);
    if (isPm && newH !== 12) newH += 12;
    if (!isPm && newH === 12) newH = 0;
    onChange(`${newH.toString().padStart(2, '0')}:${m}`);
  };

  const handleMin = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${h}:${e.target.value}`);
  };

  const handleAmPm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pm = e.target.value === "PM";
    let newH = hour24;
    if (pm && !isPm) newH = (hour24 % 12) + 12;
    if (!pm && isPm) newH = hour24 % 12;
    onChange(`${newH.toString().padStart(2, '0')}:${m}`);
  };

  return (
    <div className="flex gap-1.5 items-center bg-white border border-gray-200 rounded-lg p-1 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
      <select value={hour12} onChange={handleHour} className="p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center">
        {Array.from({length: 12}, (_, i) => i + 1).map(hr => (
          <option key={hr} value={hr}>{hr.toString().padStart(2, '0')}</option>
        ))}
      </select>
      <span className="font-bold text-gray-400">:</span>
      <select value={m} onChange={handleMin} className="p-1.5 text-sm bg-transparent outline-none flex-1 cursor-pointer appearance-none text-center">
        {["00", "15", "30", "45"].map(min => (
          <option key={min} value={min}>{min}</option>
        ))}
      </select>
      <select value={isPm ? "PM" : "AM"} onChange={handleAmPm} className="p-1.5 text-sm font-semibold bg-gray-100 rounded text-[#1E3A5F] outline-none cursor-pointer flex-1 appearance-none text-center">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

// Timer component for live tracking
function LiveTimer({ startTime, isActive }: { startTime: string; isActive: boolean }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;
    
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diffMinutes = Math.floor((now - start) / 60000);
      setDuration(diffMinutes);
    }, 60000); // Update every minute
    
    // Initial calculation
    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - start) / 60000);
    setDuration(diffMinutes);
    
    return () => clearInterval(interval);
  }, [startTime, isActive]);

  if (!isActive || !startTime) return null;
  
  return (
    <div className="flex items-center gap-2 text-blue-600 font-semibold">
      <Timer className="h-4 w-4 animate-pulse" />
      <span>Duration: {formatDuration(duration)}</span>
    </div>
  );
}

const statusColor: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  half_day: "bg-amber-100 text-amber-700",
  absent: "bg-red-100 text-red-700",
};

function AttendancePage() {
  const { user, role } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  const [today, setToday] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [teamToday, setTeamToday] = useState<any[]>([]);
  const [selectedTeamDate, setSelectedTeamDate] = useState(new Date().toISOString().slice(0, 10));
  const [profileMap, setProfileMap] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);

  const [myRegularizations, setMyRegularizations] = useState<any[]>([]);
  const [pendingRegularizations, setPendingRegularizations] = useState<any[]>([]);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applyAttendance, setApplyAttendance] = useState<any>(null);
  const [regReason, setRegReason] = useState("");
  const [regCheckIn, setRegCheckIn] = useState("09:00");
  const [regCheckOut, setRegCheckOut] = useState("18:00");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewReg, setReviewReg] = useState<any>(null);

  // Manual Attendance Entry State
  const [allowedProfiles, setAllowedProfiles] = useState<any[]>([]);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualEmpId, setManualEmpId] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0, 10));
  const [manualCheckIn, setManualCheckIn] = useState("09:00");
  const [manualCheckOut, setManualCheckOut] = useState("18:00");
  const [manualStatus, setManualStatus] = useState("present");
  
  // Export State
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStartDate, setExportStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [exportEndDate, setExportEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [exportSelectedEmployees, setExportSelectedEmployees] = useState<string[]>([]);
  
  // New location tracking state
  const [allOffices, setAllOffices] = useState<any[]>([]);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [nearestOffice, setNearestOffice] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // View mode
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    if (!user) return;
    const currentDate = new Date().toISOString().slice(0, 10);
    // Use employee_id (real schema column)
    const { data: t } = await supabase.from("attendance").select("*").eq("employee_id", user.id).eq("date", currentDate).maybeSingle();
    setToday(t);
    const { data: h } = await supabase.from("attendance").select("*").eq("employee_id", user.id).order("date", { ascending: false }).limit(30);
    setHistory(h ?? []);

    const { data: myRegs } = await supabase.from("attendance_regularizations").select("*").eq("employee_id", user.id);
    setMyRegularizations(myRegs ?? []);

    const { data: offices } = await supabase.from("office_locations").select("*");
    setAllOffices(offices ?? []);

    if (isElevated) {
      let profileQuery = supabase.from("profiles").select("id, name, email");
      if (role === "manager") {
        profileQuery = profileQuery.eq("manager_id", user.id);
      }
      const { data: profs } = await profileQuery;
      const validProfs = profs ?? [];
      setAllowedProfiles(validProfs);

      const map: Record<string, any> = {};
      validProfs.forEach((p: any) => { map[p.id] = p; });
      setProfileMap(map);

      const empIds = validProfs.map(p => p.id);
      
      if (empIds.length > 0) {
        const { data: team } = await supabase.from("attendance").select("*").eq("date", selectedTeamDate).in("employee_id", empIds).order("created_at");
        const { data: pRegs } = await supabase.from("attendance_regularizations").select("*").eq("status", "pending").in("employee_id", empIds).order("created_at");
        
        setTeamToday(team ?? []);
        setPendingRegularizations(pRegs ?? []);
      } else {
        setTeamToday([]);
        setPendingRegularizations([]);
      }
    }
  };

  // Start live timer for own check-in
  useEffect(() => {
    if (today?.check_in_time && !today?.check_out_time) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      timerInterval.current = setInterval(() => {
        const start = new Date(today.check_in_time).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.floor((now - start) / 60000);
        setLiveDuration(diffMinutes);
      }, 60000);
      
      // Initial calculation
      const start = new Date(today.check_in_time).getTime();
      const now = new Date().getTime();
      const diffMinutes = Math.floor((now - start) / 60000);
      setLiveDuration(diffMinutes);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
      setLiveDuration(0);
    }
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [today?.check_in_time, today?.check_out_time]);

  useEffect(() => { load(); }, [user, selectedTeamDate]);

  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const goBackDate = () => {
    setSelectedTeamDate(prev => addDays(prev, -1));
  };

  const goForwardDate = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setSelectedTeamDate(prev => {
      const next = addDays(prev, 1);
      return next <= todayStr ? next : prev;
    });
  };

  const formatTeamDateLabel = (dateStr: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (dateStr === todayStr) return "Today";
    const d = new Date(dateStr + "T00:00:00");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().slice(0, 10)) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Start live location tracking
  useEffect(() => {
    if (allOffices.length === 0) return;

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
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
      },
      (error) => {
        if (error.code === 1) setLocationError("Location permission denied");
        else setLocationError("Unable to fetch location");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

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
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      // Fetch office locations
      const { data: offices, error: officeError } = await supabase
        .from("office_locations")
        .select("id, name, latitude, longitude, radius_meters");

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

      const date = new Date().toISOString().slice(0, 10);
      const { error } = await supabase.from("attendance").upsert({
        employee_id: user.id,
        date,
        check_in_time: new Date().toISOString(),
        check_in_latitude: userLat,
        check_in_longitude: userLon,
        status: "present",
      }, { onConflict: "employee_id,date" });
      
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Checked in! Timer started.");
      load();

    } catch (err: any) {
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
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { 
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
      } catch (err) {
        // Silently ignore checkout location errors
      }
    }

    const checkOutTime = new Date().toISOString();
    const workedHours = today.check_in_time
      ? (new Date(checkOutTime).getTime() - new Date(today.check_in_time).getTime()) / 3600000
      : 0;
    const status = workedHours >= 8 ? "present" : workedHours >= 4 ? "half_day" : "absent";
    
    const { error } = await supabase.from("attendance").update({ 
      check_out_time: checkOutTime, 
      check_out_latitude: userLat,
      check_out_longitude: userLon,
      status, 
      updated_at: new Date().toISOString() 
    }).eq("id", today.id);
    
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Checked out! Total duration: ${formatDuration(Math.floor(workedHours * 60))}`);
    load();
  };

  const handleCardClick = (attendance: any) => {
    setSelectedAttendance(attendance);
    setShowDetailDialog(true);
  };

  const calculateDuration = (checkInTime: string, checkOutTime?: string) => {
    if (!checkInTime) return null;
    const start = new Date(checkInTime).getTime();
    const end = checkOutTime ? new Date(checkOutTime).getTime() : new Date().getTime();
    const diffMinutes = Math.floor((end - start) / 60000);
    return formatDuration(diffMinutes);
  };

  const isCheckedIn = !!today?.check_in_time;
  const isCheckedOut = !!today?.check_out_time;

  const submitRegularization = async () => {
    if (!user || !applyAttendance) return;
    setBusy(true);
    const inIso = new Date(`${applyAttendance.date}T${regCheckIn}:00+05:30`).toISOString();
    const outIso = new Date(`${applyAttendance.date}T${regCheckOut}:00+05:30`).toISOString();
    
    const { error } = await supabase.from("attendance_regularizations").insert({
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

  const resolveRegularization = async (id: number, status: string) => {
    setBusy(true);
    const { error } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Regularization ${status}`);
    setShowReviewDialog(false);
    load();
  };

  const submitManualAttendance = async () => {
    if (!manualEmpId || !manualDate) return toast.error("Please select an employee and date");
    setBusy(true);

    const inTime = new Date(`${manualDate}T${manualCheckIn}:00+05:30`).toISOString();
    const outTime = manualCheckOut ? new Date(`${manualDate}T${manualCheckOut}:00+05:30`).toISOString() : null;

    const { error } = await supabase.from("attendance").upsert({
      employee_id: manualEmpId,
      date: manualDate,
      check_in_time: inTime,
      check_out_time: outTime,
      status: manualStatus as any,
      updated_at: new Date().toISOString()
    }, { onConflict: "employee_id,date" });

    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Manual attendance recorded successfully");
    setShowManualDialog(false);
    load();
  };

  const handleExport = async () => {
    if (exportSelectedEmployees.length === 0) return toast.error("Please select at least one employee to export.");
    if (exportStartDate > exportEndDate) return toast.error("Start date cannot be after end date.");
    
    setBusy(true);
    
    const { data: attendanceData, error } = await supabase
      .from("attendance")
      .select("*, profiles!inner(id, name, email)")
      .in("employee_id", exportSelectedEmployees)
      .gte("date", exportStartDate)
      .lte("date", exportEndDate)
      .order("date", { ascending: false });
      
    setBusy(false);
    
    if (error) {
      return toast.error("Failed to fetch export data: " + error.message);
    }
    
    if (!attendanceData || attendanceData.length === 0) {
      return toast.error("No attendance records found for the selected criteria.");
    }
    
    // Generate CSV
    const headers = ["Date", "Employee Name", "Email", "Status", "Check In", "Check Out", "Duration"];
    
    const rows = attendanceData.map((record: any) => {
      const empName = record.profiles?.name || record.profiles?.email || "Unknown";
      const empEmail = record.profiles?.email || "Unknown";
      const inTime = record.check_in_time ? fmt(record.check_in_time) : "—";
      const outTime = record.check_out_time ? fmt(record.check_out_time) : "—";
      const duration = record.check_in_time && record.check_out_time ? calculateDuration(record.check_in_time, record.check_out_time) : "—";
      const status = record.status ? record.status.replace("_", " ") : "—";
      
      return [
        record.date,
        `"${empName}"`,
        `"${empEmail}"`,
        status,
        `"${inTime}"`,
        `"${outTime}"`,
        `"${duration}"`
      ].join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Export_${exportStartDate}_to_${exportEndDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export successful!");
    setShowExportDialog(false);
  };

  const toggleExportEmployee = (id: string) => {
    setExportSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleAllExportEmployees = () => {
    if (exportSelectedEmployees.length === allowedProfiles.length) {
      setExportSelectedEmployees([]);
    } else {
      setExportSelectedEmployees(allowedProfiles.map(p => p.id));
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader title="Attendance" subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
        
        {isElevated && (
          <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setViewMode("daily")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "daily" ? "bg-white text-[#154D8C] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid className="w-4 h-4" /> Daily View
            </button>
            <button 
              onClick={() => setViewMode("monthly")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "monthly" ? "bg-white text-[#154D8C] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <CalendarDays className="w-4 h-4" /> Monthly View
            </button>
          </div>
        )}
      </div>

      {viewMode === "monthly" && isElevated ? (
        <MonthlyView allowedProfiles={allowedProfiles} />
      ) : (
        <>
          {/* Location Status Bar */}
      {allOffices.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className={`p-3 rounded-xl border flex items-center justify-between shadow-sm transition-colors ${locationError ? 'bg-red-50 border-red-200' : (currentDistance !== null && nearestOffice && currentDistance <= nearestOffice.radius_meters) ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2">
              {locationError ? <AlertCircle className="w-5 h-5 text-red-500" /> : (currentDistance !== null && nearestOffice && currentDistance <= nearestOffice.radius_meters) ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />}
              <div>
                <div className="text-sm font-semibold text-gray-900">Location Status</div>
                <div className={`text-xs ${locationError ? 'text-red-700' : 'text-gray-600'}`}>
                  {locationError ? locationError : currentDistance !== null ? `Nearest Office: ${nearestOffice.name} (${Math.round(currentDistance)}m away)` : "Locating..."}
                </div>
              </div>
            </div>
            {currentDistance !== null && !locationError && nearestOffice && (
              <Badge variant="outline" className={currentDistance <= nearestOffice.radius_meters ? "bg-green-100 text-green-800 border-green-300" : "bg-amber-100 text-amber-800 border-amber-300"}>
                {currentDistance <= nearestOffice.radius_meters ? "In Range" : "Out of Range"}
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Today's card with timer */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Card className="p-6 rounded-2xl" style={{ borderColor: "#154D8C20" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Today</h3>
            {today?.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[today.status] ?? "bg-muted text-muted-foreground"}`}>
                {today.status.replace("_", " ")}
              </span>
            )}
          </div>
          
          {/* Live Timer Display */}
          {isCheckedIn && !isCheckedOut && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-900">Live Timer</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatDuration(liveDuration)}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="text-center p-3 bg-muted/30 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">Check In</div>
              <div className="font-semibold text-lg">{today?.check_in_time ? fmt(today.check_in_time) : "—"}</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">Check Out</div>
              <div className="font-semibold text-lg">{today?.check_out_time ? fmt(today.check_out_time) : "—"}</div>
            </div>
          </div>
          
          {/* Duration display for completed day */}
          {isCheckedIn && isCheckedOut && today?.check_in_time && today?.check_out_time && (
            <div className="mb-4 text-center p-2 bg-slate-100 rounded-lg">
              <span className="text-sm text-slate-600">Total Duration: </span>
              <span className="font-semibold text-slate-900">{calculateDuration(today.check_in_time, today.check_out_time)}</span>
            </div>
          )}
          
          <div className="flex gap-3">
            {!isCheckedIn && (
              <Button onClick={checkIn} disabled={busy} className="flex-1 rounded-xl gap-2" style={{ backgroundColor: "#154D8C" }}>
                <LogIn className="h-4 w-4" />Check In
              </Button>
            )}
            {isCheckedIn && !isCheckedOut && (
              <Button onClick={checkOut} disabled={busy} variant="outline" className="flex-1 rounded-xl gap-2">
                <LogOut className="h-4 w-4" />Check Out
              </Button>
            )}
            {isCheckedIn && isCheckedOut && (
              <div className="flex-1 text-center text-sm text-muted-foreground py-2">
                ✓ Attendance recorded for today
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Team today (admin/manager) - Clickable cards */}
      {isElevated && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4" style={{ color: "#154D8C" }} />Team Attendance ({teamToday.length})</h3>
            <div className="flex items-center gap-2">
              
              {/* Date Slider Component */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-8">
                <button 
                  onClick={goBackDate} 
                  className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="relative group flex items-center justify-center px-4 h-full min-w-[100px] hover:bg-gray-50 transition-colors">
                  <input 
                    type="date" 
                    value={selectedTeamDate}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setSelectedTeamDate(e.target.value)}
                    onClick={(e) => {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        try { (e.target as any).showPicker(); } catch (err) {}
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Select Date"
                  />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#154D8C] transition-colors whitespace-nowrap">
                    {formatTeamDateLabel(selectedTeamDate)}
                  </span>
                </div>

                <button 
                  onClick={goForwardDate} 
                  disabled={selectedTeamDate >= new Date().toISOString().slice(0, 10)} 
                  className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <Button onClick={() => { setExportSelectedEmployees(allowedProfiles.map(p => p.id)); setShowExportDialog(true); }} size="sm" variant="outline" className="rounded-xl shadow-sm text-xs h-8 px-3 whitespace-nowrap bg-white text-[#154D8C] border-[#154D8C] hover:bg-slate-50">
                <Download className="w-4 h-4 mr-1.5" /> Export
              </Button>

              <Button onClick={() => setShowManualDialog(true)} size="sm" className="bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-sm text-xs h-8 px-3 whitespace-nowrap">
                + Manual Entry
              </Button>
            </div>
          </div>
          {teamToday.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {teamToday.map(a => {
              const employeeName = profileMap[a.employee_id]?.name || profileMap[a.employee_id]?.email || "Unknown";
              const isToday = a.date === new Date().toISOString().slice(0, 10);
              const isStillCheckedIn = isToday && a.check_in_time && !a.check_out_time;
              const missedCheckOut = !isToday && a.check_in_time && !a.check_out_time;
              const hasCompletedShift = a.check_in_time && a.check_out_time;
              
              return (
                <Card 
                  key={a.id} 
                  className="p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: "#154D8C20" }}
                  onClick={() => handleCardClick({ ...a, employeeName })}
                >
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                    style={{ backgroundColor: "#154D8C" }}
                  >
                    {employeeName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{employeeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.check_in_time ? fmt(a.check_in_time) : "—"} {a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""}
                    </div>
                    {isStillCheckedIn && (
                      <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Timer className="h-3 w-3" />
                        <LiveTimer startTime={a.check_in_time} isActive={true} />
                      </div>
                    )}
                    {missedCheckOut && (
                      <div className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Missed Check-out
                      </div>
                    )}
                    {hasCompletedShift && (
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Duration: {calculateDuration(a.check_in_time, a.check_out_time)}
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`}>
                    {a.status?.replace("_", " ")}
                  </span>
                  {isStillCheckedIn && (
                    <div className="shrink-0">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <div className="text-sm text-slate-500">No team attendance recorded for {new Date(selectedTeamDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}.</div>
            </div>
          )}
        </div>
      )}

      {/* Pending Regularizations (admin/manager) */}
      {isElevated && pendingRegularizations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Pending Regularizations ({pendingRegularizations.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRegularizations.map(r => {
              const employeeName = profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "Unknown";
              return (
                <Card 
                  key={r.id} 
                  className="p-3.5 rounded-xl cursor-pointer hover:shadow-md transition-shadow border-amber-200 bg-amber-50/50"
                  onClick={() => { setReviewReg({ ...r, employeeName }); setShowReviewDialog(true); }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-gray-900">{employeeName}</div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">{fmtDate(r.date)}</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-1.5 line-clamp-1">
                    <span className="font-medium text-gray-700">Reason:</span> {r.reason || "No reason provided"}
                  </div>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Req: {r.requested_check_in_time ? fmt(r.requested_check_in_time) : ""} - {r.requested_check_out_time ? fmt(r.requested_check_out_time) : ""}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* History - Clickable cards */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Recent History</h3>
        <Card className="rounded-2xl divide-y" style={{ borderColor: "#154D8C20" }}>
          {history.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No attendance records yet</div>}
          {history.map((a, i) => (
            <motion.div 
              key={a.id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 p-3.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => handleCardClick({ ...a, employeeName: user?.email?.split('@')[0] || "You" })}
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{fmtDate(a.date)}</div>
                <div className="text-xs text-muted-foreground">
                  {a.check_in_time ? fmt(a.check_in_time) : "No check-in"} {a.check_out_time ? `→ ${fmt(a.check_out_time)}` : ""}
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[a.status] ?? "bg-muted text-muted-foreground"}`}>
                  {a.status?.replace("_", " ") ?? "—"}
                </span>
                
                {/* Regularization button for absent */}
                {a.status === "absent" && (
                  <div className="ml-2">
                    {(() => {
                      const existing = myRegularizations.find(r => r.attendance_id === a.id);
                      if (existing) {
                        return (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
                            existing.status === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            existing.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            Reg. {existing.status}
                          </span>
                        );
                      }
                      return (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 text-[10px] px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          onClick={(e) => { e.stopPropagation(); setApplyAttendance(a); setShowApplyDialog(true); }}
                        >
                          Apply Reg.
                        </Button>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </Card>
      </div>

      {/* Attendance Detail Dialog with Timer */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#154D8C" }}>Attendance Details</DialogTitle>
            <DialogDescription>
              {selectedAttendance?.employeeName && `Employee: ${selectedAttendance.employeeName}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAttendance && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1">Date</div>
                  <div className="font-semibold text-sm">{fmtDate(selectedAttendance.date)}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selectedAttendance.status] ?? "bg-muted text-muted-foreground"}`}>
                    {selectedAttendance.status?.replace("_", " ") || "—"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <LogIn className="h-3 w-3" /> Check In
                  </div>
                  <div className="font-semibold text-base">
                    {selectedAttendance.check_in_time ? fmt(selectedAttendance.check_in_time) : "—"}
                  </div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <LogOut className="h-3 w-3" /> Check Out
                  </div>
                  <div className="font-semibold text-base">
                    {selectedAttendance.check_out_time ? fmt(selectedAttendance.check_out_time) : "—"}
                  </div>
                </div>
              </div>
              
              {/* Timer/Duration Section */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Duration</span>
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {selectedAttendance.check_in_time ? (
                      calculateDuration(
                        selectedAttendance.check_in_time, 
                        selectedAttendance.check_out_time
                      )
                    ) : "—"}
                  </div>
                </div>
                
                {/* Live timer for active check-ins */}
                {selectedAttendance.check_in_time && !selectedAttendance.check_out_time && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <LiveTimer startTime={selectedAttendance.check_in_time} isActive={true} />
                    <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Still checked in - timer is live
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Info */}
              {(selectedAttendance.check_in_time && selectedAttendance.check_out_time) && (
                <div className="text-center text-xs text-muted-foreground">
                  Total working time recorded for this day
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply Regularization Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ color: "#154D8C" }}>Apply Regularization</DialogTitle>
            <DialogDescription>
              {applyAttendance && fmtDate(applyAttendance.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Check In Time</label>
                <TimePicker12 value={regCheckIn} onChange={setRegCheckIn} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Check Out Time</label>
                <TimePicker12 value={regCheckOut} onChange={setRegCheckOut} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Reason for absence/regularization</label>
              <textarea 
                className="w-full text-sm p-3 rounded-lg border border-gray-200 min-h-[80px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
                placeholder="Forgot to punch in, approved field work..." 
                value={regReason} 
                onChange={e => setRegReason(e.target.value)} 
              />
            </div>
            <Button onClick={submitRegularization} disabled={busy || !regReason.trim()} className="w-full rounded-xl gap-2" style={{ backgroundColor: "#154D8C" }}>
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Regularization Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
            <DialogDescription>
              {reviewReg?.employeeName} • {reviewReg && fmtDate(reviewReg.date)}
            </DialogDescription>
          </DialogHeader>
          {reviewReg && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-xs text-gray-500 mb-1">Requested In</div>
                  <div className="font-semibold text-sm">{fmt(reviewReg.requested_check_in_time)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-xs text-gray-500 mb-1">Requested Out</div>
                  <div className="font-semibold text-sm">{fmt(reviewReg.requested_check_out_time)}</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 mb-1.5 font-medium">Reason Provided</div>
                <div className="text-sm text-gray-800 leading-relaxed">{reviewReg.reason}</div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors" disabled={busy} onClick={() => resolveRegularization(reviewReg.id, 'rejected')}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors" disabled={busy} onClick={() => resolveRegularization(reviewReg.id, 'approved')}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Manual Entry Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ color: "#154D8C" }}>Manual Attendance Entry</DialogTitle>
            <DialogDescription>Manually record attendance for an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Employee</label>
              <select 
                value={manualEmpId} 
                onChange={(e) => setManualEmpId(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]"
              >
                <option value="">Select Employee</option>
                {allowedProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name || p.email}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Date</label>
              <input 
                type="date" 
                value={manualDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full p-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Check In Time</label>
                <TimePicker12 value={manualCheckIn} onChange={setManualCheckIn} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Check Out Time</label>
                <TimePicker12 value={manualCheckOut} onChange={setManualCheckOut} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Status</label>
              <div className="flex gap-2">
                {["present", "half_day", "absent"].map(status => (
                  <button
                    key={status}
                    onClick={() => setManualStatus(status)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
                      manualStatus === status 
                        ? (status === "present" ? "bg-green-100 text-green-700 border-green-300" 
                           : status === "half_day" ? "bg-amber-100 text-amber-700 border-amber-300"
                           : "bg-red-100 text-red-700 border-red-300")
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={submitManualAttendance} 
              disabled={busy || !manualEmpId || !manualDate} 
              className="w-full rounded-xl mt-2" 
              style={{ backgroundColor: "#154D8C" }}
            >
              Save Attendance
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#154D8C" }} className="flex items-center gap-2">
              <Download className="w-5 h-5" /> Export Attendance
            </DialogTitle>
            <DialogDescription>Download attendance records as a CSV file</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Start Date</label>
                <input 
                  type="date" 
                  value={exportStartDate}
                  max={exportEndDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">End Date</label>
                <input 
                  type="date" 
                  value={exportEndDate}
                  min={exportStartDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#154D8C] focus:ring-1 focus:ring-[#154D8C]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">Select Employees</label>
                <button 
                  onClick={toggleAllExportEmployees} 
                  className="text-xs text-[#154D8C] font-medium hover:underline"
                >
                  {exportSelectedEmployees.length === allowedProfiles.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-48 overflow-y-auto">
                {allowedProfiles.map(p => (
                  <label key={p.id} className="flex items-center gap-3 p-2.5 hover:bg-white border-b border-gray-100 cursor-pointer transition-colors last:border-0">
                    <input 
                      type="checkbox" 
                      checked={exportSelectedEmployees.includes(p.id)}
                      onChange={() => toggleExportEmployee(p.id)}
                      className="w-4 h-4 rounded text-[#154D8C] focus:ring-[#154D8C]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{p.name || p.email}</div>
                      <div className="text-xs text-gray-500 truncate">{p.email}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 text-right">
                {exportSelectedEmployees.length} selected
              </div>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={busy || exportSelectedEmployees.length === 0} 
              className="w-full rounded-xl mt-2" 
              style={{ backgroundColor: "#154D8C" }}
            >
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      )}
    </>
  );
}