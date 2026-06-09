import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Menu, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-background w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <AppSidebar />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-2xl flex bg-background"
            >
              <AppSidebar 
                isMobile={true} 
                className="w-full flex flex-col h-full bg-[#154D8C] text-white shadow-xl z-20" 
                onMobileClose={() => setIsMobileOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Neelgund Developers" className="h-8 w-auto object-contain" />
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-[#154D8C] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 w-full"><Outlet /></div>
      </main>
    </div>
  );
}
