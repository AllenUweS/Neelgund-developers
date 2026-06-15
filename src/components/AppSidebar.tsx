import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Clock, Map, Users, FileText, Bell,
  BarChart3, Settings, Building2, LogOut, UserCircle, Briefcase, Trophy, CalendarCheck
} from "lucide-react";
import { useAuth, type AppRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; roles?: AppRole[] };

const items: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/attendance", label: "Attendance", icon: Clock },
  { to: "/regularizations", label: "Regularizations", icon: CalendarCheck },
  { to: "/leads", label: "Leads CRM", icon: Briefcase, roles: ["employee", "admin", "super_admin", "manager", "transport"] },
  { to: "/map", label: "Live Map", icon: Map, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/employees", label: "Employees", icon: Users, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/hr-management", label: "HR Management", icon: Users, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["hr", "admin", "super_admin", "manager"] },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin", "super_admin"] },
];

export function AppSidebar({ 
  className, 
  onMobileClose,
  isMobile
}: { 
  className?: string; 
  onMobileClose?: () => void;
  isMobile?: boolean;
}) {
  const { role, user, profile, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = items.filter((i) => !i.roles || (role && i.roles.includes(role)));

  return (
    <aside className={className || "hidden md:flex w-64 flex-col bg-[#154D8C] text-white shadow-xl z-20"}>
      <div className="h-20 flex items-center justify-center px-5 border-b border-white/10">
        <div className="w-full bg-white rounded-xl py-2 px-3 shadow-md flex items-center justify-center">
          <img src="/logo-v4.png?v=20260612" alt="Neelgund Developers" className="h-10 w-auto object-contain" />
        </div>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {visible.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} onClick={onMobileClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? "text-[#154D8C]" : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}>
              {active && (
                <motion.div layoutId={isMobile ? "active-nav-mobile" : "active-nav-desktop"} className="absolute inset-0 rounded-xl bg-white shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#154D8C] shadow-sm">
            {(profile?.name || user?.email)?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{profile?.name || user?.email}</div>
            <div className="text-[10px] uppercase tracking-wider text-blue-200">{role?.replace("_", " ")}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start gap-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
