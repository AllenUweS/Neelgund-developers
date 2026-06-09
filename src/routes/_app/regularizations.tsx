import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  CalendarCheck, Clock, CheckCircle2, XCircle, Search, 
  Filter, AlertCircle, FileText, User 
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/regularizations")({
  head: () => ({ meta: [{ title: "Regularizations — Neelgund Developers" }] }),
  component: RegularizationsPage,
});

function fmtTime(iso: string | null) { 
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }); 
}

function fmtDate(d: string | null) { 
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); 
}

function RegularizationsPage() {
  const { user, role } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, any>>({});
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch regularizations
    let query = supabase.from("attendance_regularizations").select("*").order("created_at", { ascending: false });
    
    // Employees see only their own, managers/admins see all
    if (!isElevated) {
      query = query.eq("employee_id", user.id);
    }
    
    const { data: regs, error } = await query;
    if (error) { toast.error(error.message); setLoading(false); return; }
    
    setData(regs || []);
    
    // Fetch profiles for names
    const empIds = [...new Set((regs || []).map(r => r.employee_id))];
    if (empIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id, name, email").in("id", empIds);
      const map: Record<string, any> = {};
      (profs || []).forEach(p => map[p.id] = p);
      setProfileMap(map);
    }
    
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user, isElevated]);

  const resolveReg = async (id: number, status: string) => {
    const { error } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Request ${status} successfully`);
    
    // Update local state smoothly
    setData(prev => prev.map(r => r.id === id ? { ...r, status, resolved_at: new Date().toISOString() } : r));
  };

  const filtered = useMemo(() => {
    return data.filter(r => {
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const empName = (profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "").toLowerCase();
      const matchSearch = search === "" || empName.includes(search.toLowerCase()) || (r.reason || "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [data, statusFilter, search, profileMap]);

  // Stats
  const total = data.length;
  const pending = data.filter(r => r.status === "pending").length;
  const approved = data.filter(r => r.status === "approved").length;
  const rejected = data.filter(r => r.status === "rejected").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Regularizations History" 
        subtitle="Track, filter, and manage all attendance regularization requests." 
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: pending, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", value: approved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="p-2 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by name or reason..." 
            className="pl-9 bg-transparent border-0 focus-visible:ring-0 shadow-none h-10"
          />
        </div>
        <div className="h-px sm:h-auto sm:w-px bg-gray-100 mx-2" />
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                statusFilter === s ? "bg-[#154D8C] text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">Loading regularizations...</div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 rounded-2xl border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No requests found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((r, i) => {
                const empName = profileMap[r.employee_id]?.name || profileMap[r.employee_id]?.email || "Unknown";
                const isPending = r.status === "pending";
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    key={r.id}
                  >
                    <Card className={`overflow-hidden rounded-2xl border ${isPending ? 'border-amber-200' : 'border-gray-100'} transition-all hover:shadow-md h-full flex flex-col`}>
                      <div className={`px-4 py-3 border-b flex justify-between items-center ${isPending ? 'bg-amber-50/50' : 'bg-gray-50/50'}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs font-bold text-gray-700">
                            {empName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm leading-tight text-gray-900">{empName}</div>
                            <div className="text-[10px] text-gray-500">{fmtDate(r.date)}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`capitalize ${
                          r.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          r.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {r.status}
                        </Badge>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Check In</div>
                            <div className="font-semibold text-sm flex items-center gap-1.5 text-[#154D8C]">
                              <Clock className="w-3.5 h-3.5" />
                              {fmtTime(r.requested_check_in_time)}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Check Out</div>
                            <div className="font-semibold text-sm flex items-center gap-1.5 text-[#154D8C]">
                              <Clock className="w-3.5 h-3.5" />
                              {fmtTime(r.requested_check_out_time)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Reason</div>
                          <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-3">
                            "{r.reason || "No reason provided."}"
                          </p>
                        </div>

                        {/* Manager Actions */}
                        {isElevated && isPending && (
                          <div className="flex gap-2 mt-5 pt-4 border-t border-dashed border-gray-200">
                            <Button 
                              variant="outline" 
                              onClick={() => resolveReg(r.id, 'rejected')}
                              className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                            <Button 
                              onClick={() => resolveReg(r.id, 'approved')}
                              className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white h-9"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </Button>
                          </div>
                        )}
                        {/* Display resolved info if applicable */}
                        {!isPending && r.resolved_at && (
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                            <User className="w-3 h-3" />
                            Resolved on {fmtDate(r.resolved_at)}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
