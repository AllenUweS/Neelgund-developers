import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 shadow-lg">
          <img
            src="/logo-v4.png"
            alt="Neelgund Developers"
            className="h-20 w-20 object-contain drop-shadow-md"
            onError={(e) => {
              // Fallback if logo is missing or different path
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          {/* Fallback Icon */}
          <div className="hidden h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-3xl font-bold">ND</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center space-y-2 text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Neelgund Developers
          </h1>
          <p className="text-sm text-muted-foreground">
            Workforce Platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
        </motion.div>
      </motion.div>
    </div>
  );
}
