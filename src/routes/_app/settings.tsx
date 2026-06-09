import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Neelgund Developers" }] }),
  component: () => (
    <>
      <PageHeader title="Company settings" subtitle="Super admin only — manage company-wide configuration." />
      <Card className="rounded-2xl p-12 text-center border-dashed flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <SettingsIcon className="h-7 w-7" />
        </div>
        <p className="text-sm text-muted-foreground max-w-md">Departments, branches, roles, map and policy settings.</p>
      </Card>
    </>
  ),
});