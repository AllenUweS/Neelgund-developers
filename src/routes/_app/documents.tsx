import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Neelgund Developers" }] }),
  component: () => (
    <>
      <PageHeader title="Document center" subtitle="Upload ID proofs, certificates, contracts." />
      <Card className="rounded-2xl p-12 flex flex-col items-center text-center border-dashed">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <p className="text-sm text-muted-foreground">Storage bucket <code className="px-1.5 py-0.5 rounded bg-muted">documents</code> is ready.</p>
      </Card>
    </>
  ),
});