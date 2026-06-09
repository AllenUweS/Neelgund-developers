import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Neelgund Developers" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, [user]);

  return (
    <>
      <PageHeader title="Notifications" subtitle="Stay on top of your day." />
      <Card className="rounded-2xl divide-y">
        {items.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            You're all caught up.
          </div>
        )}
        {items.map((n) => (
          <div key={n.id} className="p-4 flex items-start gap-3">
            <div className={`h-2 w-2 rounded-full mt-2 ${n.read ? "bg-muted" : "bg-primary"}`} />
            <div className="flex-1">
              <div className="font-medium text-sm">{n.title}</div>
              {n.body && <div className="text-xs text-muted-foreground mt-1">{n.body}</div>}
            </div>
            <div className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </Card>
    </>
  );
}