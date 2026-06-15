import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function MonthlyView({ allowedProfiles }: { allowedProfiles: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMonthData = async () => {
    if (allowedProfiles.length === 0) return;
    setLoading(true);
    
    const start = new Date(currentMonth);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const formatLocal = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    
    const startStr = formatLocal(start);
    const endStr = formatLocal(end);
    
    const empIds = allowedProfiles.map(p => p.id);
    
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .in("employee_id", empIds)
      .gte("date", startStr)
      .lte("date", endStr);
      
    setAttendanceData(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth, allowedProfiles]);

  const goBackMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goForwardMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group by employee
  const attByEmp = attendanceData.reduce((acc, curr) => {
    if (!acc[curr.employee_id]) acc[curr.employee_id] = {};
    const day = parseInt(curr.date.split("-")[2], 10);
    acc[curr.employee_id][day] = curr;
    return acc;
  }, {} as Record<string, Record<number, any>>);

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-400';
      case 'half_day': return 'bg-amber-400';
      case 'absent': return 'bg-red-400';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-6 mt-4">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">Monthly Overview</h3>
        <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-9">
          <button onClick={goBackMonth} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="px-4 font-bold text-sm text-[#154D8C] min-w-[140px] text-center">
            {monthLabel}
          </div>
          <button onClick={goForwardMonth} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-x-auto w-full">
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-6 h-6 text-[#154D8C] animate-spin" />
          </div>
        )}
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-gray-500 bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 sticky left-0 z-10 bg-gray-50/95 backdrop-blur-sm border-r border-gray-100 min-w-[180px]">
                Employee
              </th>
              {daysArray.map(d => (
                <th key={d} scope="col" className="px-2 py-3 text-center min-w-[36px] font-medium">
                  {d}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-center min-w-[80px] bg-gray-50/80 sticky right-0 shadow-[-4px_0_12px_rgba(0,0,0,0.02)] border-l border-gray-100">
                Total P
              </th>
            </tr>
          </thead>
          <tbody>
            {allowedProfiles.map(p => {
              const empAtt = attByEmp[p.id] || {};
              let totalPresent = 0;
              let totalHalf = 0;
              
              daysArray.forEach(d => {
                if (empAtt[d]?.status === 'present') totalPresent += 1;
                if (empAtt[d]?.status === 'half_day') totalHalf += 1;
              });
              
              const totalEquivalent = totalPresent + (totalHalf * 0.5);

              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3 sticky left-0 z-10 bg-white group-hover:bg-blue-50/80 transition-colors border-r border-gray-100">
                    <div className="font-medium text-gray-900 truncate w-[160px]">{p.name || p.email}</div>
                  </td>
                  {daysArray.map(d => {
                    const status = empAtt[d]?.status;
                    const dateStr = empAtt[d]?.date;
                    const isWeekend = (() => {
                      const dt = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                      return dt.getDay() === 0; // Sunday
                    })();
                    
                    return (
                      <td key={d} className={`px-2 py-2.5 text-center ${isWeekend && !status ? 'bg-gray-50/50' : ''}`} title={dateStr ? `${dateStr}: ${status?.replace("_", " ")}` : "No Record"}>
                        <div className="flex justify-center">
                          {status ? (
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)} shadow-sm ring-2 ring-white`} />
                          ) : (
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold text-[#154D8C] sticky right-0 bg-white group-hover:bg-blue-50/80 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.02)] border-l border-gray-100">
                    {totalEquivalent}
                  </td>
                </tr>
              );
            })}
            
            {allowedProfiles.length === 0 && (
              <tr>
                <td colSpan={daysArray.length + 2} className="px-4 py-8 text-center text-gray-500">
                  No employees found for this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" /> Present</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Half Day</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" /> Absent</div>
        <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-gray-200" /> No Record</div>
      </div>
    </div>
  );
}
