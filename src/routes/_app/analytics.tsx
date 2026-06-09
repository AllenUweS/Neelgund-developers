import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, BarChart3, PieChart as PieChartIcon, TrendingUp, Layers } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Neelgund Developers" }] }),
  component: AnalyticsPage,
});

// Vibrant colors for charts
const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

function AnalyticsPage() {
  const { user, role } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  
  const [loading, setLoading] = useState(true);
  
  // Chart Data States
  const [productivity, setProductivity] = useState<{date: string, present: number}[]>([]);
  const [leadSources, setLeadSources] = useState<{name: string, value: number}[]>([]);
  const [leadPipeline, setLeadPipeline] = useState<{stage: string, count: number}[]>([]);
  const [leadPriority, setLeadPriority] = useState<{name: string, value: number, color: string}[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!isElevated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        // 1. Fetch Attendance (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateStr = thirtyDaysAgo.toLocaleDateString('en-CA');
        
        const { data: attData } = await supabase
          .from("attendance")
          .select("date, status")
          .gte("date", dateStr);
          
        const dateMap: Record<string, number> = {};
        // Initialize last 30 days to 0
        for(let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dateMap[d.toLocaleDateString('en-CA')] = 0;
        }
        
        (attData || []).forEach(a => {
          if (a.status === "present" || a.status === "late_present" || a.status === "half_day") {
            if (dateMap[a.date] !== undefined) {
              dateMap[a.date]++;
            }
          }
        });
        
        setProductivity(
          Object.entries(dateMap).map(([d, present]) => ({
            date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            present
          }))
        );

        // 2. Fetch Leads (All)
        let allLeads: any[] = [];
        let start = 0;
        const step = 1000;
        while (true) {
          const { data } = await supabase.from("leads").select("status, source, priority").range(start, start + step - 1);
          if (data) allLeads = allLeads.concat(data);
          if (!data || data.length < step) break;
          start += step;
        }
        
        // Process Sources
        const sourcesMap: Record<string, number> = {};
        allLeads.forEach(l => {
          const s = (l.source || "unknown").replace(/_/g, " ");
          sourcesMap[s] = (sourcesMap[s] || 0) + 1;
        });
        
        setLeadSources(
          Object.entries(sourcesMap)
            .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
            .sort((a, b) => b.value - a.value)
        );
        
        // Process Pipeline
        const pipelineMap: Record<string, number> = {};
        allLeads.forEach(l => {
          const s = l.status || "new";
          pipelineMap[s] = (pipelineMap[s] || 0) + 1;
        });
        
        setLeadPipeline([
          { stage: "New", count: pipelineMap["new"] || 0 },
          { stage: "Not Contacted", count: pipelineMap["not_contacted"] || 0 },
          { stage: "Follow-up", count: pipelineMap["follow_up"] || 0 },
          { stage: "Meeting", count: pipelineMap["meeting_scheduled"] || 0 },
          { stage: "Negotiation", count: pipelineMap["negotiation"] || 0 },
          { stage: "Won", count: pipelineMap["closed_won"] || 0 },
          { stage: "Lost", count: pipelineMap["closed_lost"] || 0 },
        ]);
        
        // Process Priorities
        const priorityMap: Record<string, number> = {};
        allLeads.forEach(l => {
          const p = l.priority || "unassigned";
          priorityMap[p] = (priorityMap[p] || 0) + 1;
        });
        
        setLeadPriority([
          { name: "Hot", value: priorityMap["hot"] || 0, color: "#EF4444" },
          { name: "Warm", value: priorityMap["warm"] || 0, color: "#F59E0B" },
          { name: "Cold", value: priorityMap["cold"] || 0, color: "#3B82F6" },
        ].filter(p => p.value > 0));

      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user, isElevated]);

  if (!isElevated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-500 max-w-sm">
          Analytics and company-wide metrics are restricted to management and administrative roles.
        </p>
      </div>
    );
  }

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
      {/* Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Analytics Command Center
          </h1>
          <p className="text-gray-500 text-sm">
            Deep insights and 30-day performance trends for the company.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 shadow-sm w-fit self-start sm:self-auto uppercase tracking-wider text-[10px]">
          LIVE DATA
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 30-Day Productivity Chart */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">30-Day Workforce Productivity</h3>
                <p className="text-sm text-gray-500">Daily count of present employees</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#6366F1', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="present" name="Present Workforce" stroke="#6366F1" strokeWidth={3} fill="url(#prodGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Lead Source Breakdown */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lead Sources</h3>
                <p className="text-sm text-gray-500">Where are your leads coming from?</p>
              </div>
              <PieChartIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={leadSources} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={75} 
                    outerRadius={105} 
                    paddingAngle={3}
                    stroke="none"
                  >
                    {leadSources.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#4B5563' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Lead Pipeline & Priority */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 rounded-3xl border-0 shadow-lg bg-white h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lead Conversion</h3>
                <p className="text-sm text-gray-500">Pipeline health across all stages</p>
              </div>
              <Layers className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadPipeline} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pipeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#FBCFE8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(236, 72, 153, 0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#EC4899', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" name="Leads" fill="url(#pipeGradient)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Mini-stats */}
            <div className="mt-auto grid grid-cols-3 gap-3">
              {leadPriority.map(p => (
                <div key={p.name} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black" style={{ color: p.color }}>{p.value}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">{p.name}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}