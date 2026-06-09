import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, Briefcase, MapPin, CheckCircle2, Activity, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Neelgund Developers" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);

  // Live Data State
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [leadsByStage, setLeadsByStage] = useState<{ stage: string, v: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string, v: number, c: string }[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<{ day: string, present: number }[]>([]);
  const [inTheField, setInTheField] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [attendancePct, setAttendancePct] = useState(0);

  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);

      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

      try {
        // 1. Fetch total employees
        const { count: empCount } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true });

        const totalEmp = empCount || 0;
        setTotalEmployees(totalEmp);

        // 2. Fetch all leads (batching to bypass 1000 limit)
        let allLeads: any[] = [];
        let start = 0;
        const step = 1000;
        while (true) {
          const { data } = await supabase.from("leads").select("status").range(start, start + step - 1);
          if (data) allLeads = allLeads.concat(data);
          if (!data || data.length < step) break;
          start += step;
        }

        setTotalLeads(allLeads.length);

        // Calculate Lead Pipeline stats
        const leadCounts: Record<string, number> = {};
        allLeads.forEach(l => {
          const s = l.status || "new";
          leadCounts[s] = (leadCounts[s] || 0) + 1;
        });

        setLeadsByStage([
          { stage: "New", v: leadCounts["new"] || 0 },
          { stage: "Follow-up", v: leadCounts["follow_up"] || 0 },
          { stage: "Meeting", v: leadCounts["meeting_scheduled"] || 0 },
          { stage: "Negotiation", v: leadCounts["negotiation"] || 0 },
          { stage: "Won", v: leadCounts["closed_won"] || 0 },
        ]);

        // 3. Fetch Today's Attendance
        const { data: todayAtt } = await supabase
          .from("attendance")
          .select("*")
          .eq("date", today);

        let present = 0, late = 0, half = 0, absent = 0, inField = 0;

        (todayAtt || []).forEach(a => {
          // In the field: Checked in, but not checked out
          if (a.check_in_time && !a.check_out_time) inField++;

          let effStatus = a.status;

          // Enforce duration-based status for everyone who checked in
          if (a.check_in_time) {
            const start = new Date(a.check_in_time).getTime();
            const end = a.check_out_time ? new Date(a.check_out_time).getTime() : new Date().getTime();
            const workedHours = (end - start) / 3600000;

            if (workedHours >= 8) effStatus = "present";
            else if (workedHours >= 4) effStatus = "half_day";
            else effStatus = "absent";

            // Preserve late flag if it exists
            if (a.status === "late_present" || a.is_late) {
              if (effStatus === "present") effStatus = "late_present";
            }
          }

          if (effStatus === "half_day") {
            half++;
          } else if (effStatus === "absent") {
            absent++;
          } else if (effStatus === "late_present") {
            late++;
          } else if (effStatus === "present") {
            present++;
          }
        });

        // Employees who haven't checked in at all today
        const totalMarked = present + late + half + absent;
        const notInYet = Math.max(0, totalEmp - totalMarked);

        setPresentToday(present + late + half);
        setInTheField(inField);
        setAttendancePct(totalEmp > 0 ? Math.round(((present + late + half) / totalEmp) * 100) : 0);

        setPieData([
          { name: "Present", v: present, c: "#10B981" }, // Emerald
          { name: "Late", v: late, c: "#F59E0B" },       // Amber
          { name: "Half Day", v: half, c: "#3B82F6" },   // Blue
          { name: "Absent", v: absent, c: "#EF4444" },   // Red
          { name: "Not in yet", v: notInYet, c: "#E5E7EB" }, // Gray
        ].filter(item => item.v > 0));

        // 4. Fetch 7-Day Attendance Trend
        const past7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString("en-CA");
        });

        const { data: weekAtt } = await supabase
          .from("attendance")
          .select("date, status")
          .in("date", past7Days);

        const trendMap: Record<string, number> = {};
        past7Days.forEach(d => trendMap[d] = 0);
        (weekAtt || []).forEach(a => {
          if (a.status === "present" || a.status === "late_present" || a.status === "half_day") {
            trendMap[a.date]++;
          }
        });

        setAttendanceTrend(
          past7Days.map(d => ({
            day: new Date(d).toLocaleDateString("en-US", { weekday: "short" }),
            present: trendMap[d]
          }))
        );

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Activity className="h-8 w-8 text-[#154D8C] opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Fabulous Header (Static) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#154D8C] via-[#1E3A8A] to-[#312E81] p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {greet}, {user?.email?.split("@")[0] ?? "there"}!
            </h1>
            <p className="text-blue-100/80 max-w-lg text-sm sm:text-base">
              Here is your live intelligence overview for the {role?.replace("_", " ")} workspace.
              Everything is syncing in real-time.
            </p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm w-fit self-start sm:self-auto">
            {role?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Glowing Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Workforce", value: totalEmployees, icon: Users, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
          { label: "Active Today", value: presentToday, hint: `${attendancePct}% attendance`, icon: CheckCircle2, color: "from-emerald-400 to-green-500", shadow: "shadow-emerald-500/20" },
          { label: "In the Field", value: inTheField, hint: "Live Tracking", icon: MapPin, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
          { label: "Total Leads", value: totalLeads, hint: "CRM Database", icon: Briefcase, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
            <Card className="relative overflow-hidden p-6 rounded-3xl border-0 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              {/* Subtle gradient background flair */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${s.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`} />

              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} ${s.shadow} flex items-center justify-center text-white shadow-lg`}>
                  <s.icon className="h-6 w-6" />
                </div>
                {s.hint && <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{s.hint}</span>}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-500">{s.label}</h3>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.value}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Trend (Glassmorphic Area Chart) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Attendance Pulse</h3>
                <p className="text-sm text-gray-500">7-Day active workforce trend</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="present" name="Present" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Live Status (Donut Chart) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Live Status</h3>
            <p className="text-sm text-gray-500 mb-6">Today's workforce distribution</p>

            <div className="flex-1 min-h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="v"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.c} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900">{totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0}%</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Present</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-6 bg-gray-50 p-4 rounded-2xl">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.c }} />
                  <span className="text-xs font-medium text-gray-600">{p.name}</span>
                  <span className="ml-auto text-sm font-bold text-gray-900">{p.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Lead Pipeline Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Lead Pipeline</h3>
              <p className="text-sm text-gray-500">Conversion breakdown by stage</p>
            </div>
            <Badge variant="outline" className="text-[#154D8C] border-[#154D8C]/20 bg-blue-50/50 rounded-full px-3 py-1">
              {totalLeads} Total Leads
            </Badge>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStage} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#C4B5FD" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#8B5CF6', fontWeight: 'bold' }}
                />
                <Bar dataKey="v" name="Leads" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}