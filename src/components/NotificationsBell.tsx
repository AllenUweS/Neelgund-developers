import { useEffect, useState } from "react";
import { Bell, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NotificationsBell() {
  const { user, role } = useAuth();
  const isElevated = role === "hr" || role === "admin" || role === "super_admin" || role === "manager";
  
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const loadPending = async () => {
    if (!isElevated || !user) return;
    setLoading(true);
    try {
      // 1. Get pending regularizations first
      let query = supabase
        .from("attendance_regularizations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      const { data: rawRegs } = await query;
      if (!rawRegs || rawRegs.length === 0) {
        setPending([]);
        return;
      }

      let filteredRegs = rawRegs;

      // 2. If manager, filter by their direct reports
      let profileIds = [...new Set(rawRegs.map(r => r.employee_id))];
      
      if (role === "manager") {
        const { data: directReports } = await supabase
          .from("profiles")
          .select("id")
          .eq("manager_id", user.id);
        const reportIds = new Set((directReports || []).map(p => p.id));
        filteredRegs = rawRegs.filter(r => reportIds.has(r.employee_id));
        profileIds = [...new Set(filteredRegs.map(r => r.employee_id))];
      }

      if (filteredRegs.length === 0) {
        setPending([]);
        return;
      }

      // 3. Fetch profiles to get names
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", profileIds);
        
      const profMap: Record<string, any> = {};
      (profs || []).forEach(p => profMap[p.id] = p);

      const enrichedRegs = filteredRegs.map(reg => ({
        ...reg,
        profiles: profMap[reg.employee_id]
      }));

      setPending(enrichedRegs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadPending();
  }, [open, role, user]);

  useEffect(() => {
    // Initial load for the badge count
    loadPending();
  }, [role, user]);

  const resolveReg = async (id: number, status: "approved" | "rejected") => {
    setBusy(true);
    const { error } = await supabase.rpc("approve_attendance_regularization", {
      p_regularization_id: id,
      p_new_status: status
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Regularization ${status}`);
    setPending(prev => prev.filter(r => r.id !== id));
  };

  if (!isElevated) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-full bg-white shadow-md border border-gray-100 hover:bg-slate-50 text-[#154D8C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#154D8C]/20">
          <Bell className="h-5 w-5" />
          {pending.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
              {pending.length > 99 ? '99+' : pending.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl overflow-hidden border-gray-100 z-[60]">
        <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-semibold text-gray-800 text-sm">Pending Regularizations</h4>
          <span className="bg-[#154D8C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {pending.length} New
          </span>
        </div>
        
        <div className="max-h-[360px] overflow-y-auto">
          {loading && pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#154D8C] animate-spin mb-2" />
              <p className="text-xs text-gray-500">Loading requests...</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800">All caught up!</p>
              <p className="text-xs text-gray-500 mt-1">No pending regularizations.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pending.map(reg => {
                const dateStr = new Date(reg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                const inTime = new Date(reg.requested_check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                const outTime = new Date(reg.requested_check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                
                return (
                  <div key={reg.id} className="p-4 hover:bg-blue-50/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-sm text-gray-900">{reg.profiles?.name || reg.profiles?.email}</div>
                      <div className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{dateStr}</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Requested:</span>
                        <span className="font-medium">{inTime} - {outTime}</span>
                      </div>
                      {reg.reason && (
                        <div className="text-gray-500 italic mt-1 border-t border-gray-100 pt-1">
                          "{reg.reason}"
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        disabled={busy} 
                        size="sm" 
                        onClick={() => resolveReg(reg.id, "approved")}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 shadow-sm h-8 rounded-lg text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approve
                      </Button>
                      <Button 
                        disabled={busy} 
                        size="sm" 
                        onClick={() => resolveReg(reg.id, "rejected")}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 shadow-sm h-8 rounded-lg text-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
