import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function StatCard({ label, value, hint, icon: Icon, accent = "primary", delay = 0 }: {
  label: string; value: string | number; hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "success" | "warning" | "destructive"; delay?: number;
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-5 rounded-2xl border-border/60 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </Card>
    </motion.div>
  );
}