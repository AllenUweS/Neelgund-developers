import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Search, RefreshCw, User, Phone, Building2,
  ChevronRight, Download, LayoutGrid, Table2,
  ArrowLeft, Trophy, Users, Layers,
  TrendingUp, CheckCircle2, XCircle, Clock,
  FileSpreadsheet, Filter, X, Flame, Calendar,
  Mail, Paperclip, MapPin, MapPinned, IndianRupee, Share2, FileText, ArrowRightLeft
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Leads CRM — Neelgund Developers" }] }),
  component: LeadsPage,
});

// ─── Types & constants ────────────────────────────────────────────────────────

type LeadStatus =
  | "new" | "not_contacted" | "follow_up"
  | "meeting_scheduled" | "negotiation"
  | "closed_won" | "closed_lost";

const STATUSES: LeadStatus[] = [
  "new", "not_contacted", "follow_up",
  "meeting_scheduled", "negotiation",
  "closed_won", "closed_lost",
];

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  not_contacted: "Not Contacted",
  follow_up: "Follow Up",
  meeting_scheduled: "Meeting",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  not_contacted: "bg-orange-100 text-orange-700 border-orange-200",
  follow_up: "bg-amber-100 text-amber-700 border-amber-200",
  meeting_scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  negotiation: "bg-violet-100 text-violet-700 border-violet-200",
  closed_won: "bg-green-100 text-green-700 border-green-200",
  closed_lost: "bg-red-100 text-red-700 border-red-200",
};

const PRIORITY_COLOR: Record<string, string> = {
  hot: "text-red-500",
  warm: "text-amber-500",
  cold: "text-blue-400",
};

const PRIORITY_BG: Record<string, string> = {
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  cold: "bg-blue-50 text-blue-600 border-blue-200",
};

const SOURCES = [
  "referral", "walk_in", "online", "social",
  "broker", "cold_call", "field_activity",
] as const;

const PRIORITIES = ["hot", "warm", "cold"] as const;

const emptyForm = {
  name: "", phone: "", email: "", property_interest: "",
  budget: "", address: "", source: "",
  priority: "warm" as string,
  status: "new" as LeadStatus,
  notes: "", follow_up_date: "",
};

type AdminLevel = "teams" | "employees" | "leads" | "all";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function exportToCSV(
  leads: any[],
  profileMap: Record<string, any>,
  filename: string
) {
  const headers = [
    "Name", "Phone", "Email", "Property Interest", "Budget",
    "Priority", "Status", "Source", "Address", "Follow-up Date",
    "Assigned To", "Notes", "Created At",
  ];
  const rows = leads.map((l) => [
    l.name ?? "",
    l.phone ?? "",
    l.email ?? "",
    l.property_interest ?? "",
    l.budget ?? "",
    l.priority ?? "",
    STATUS_LABEL[l.status as LeadStatus] ?? l.status ?? "",
    (l.source ?? "").replace(/_/g, " "),
    l.address ?? "",
    l.follow_up_date ?? "",
    profileMap[l.employee_id]?.name ?? "",
    (l.notes ?? "").replace(/\n/g, " "),
    formatDate(l.created_at),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── ExportDialog ─────────────────────────────────────────────────────────────

function ExportDialog({
  leads,
  profileMap,
  employees,
}: {
  leads: any[];
  profileMap: Record<string, any>;
  employees: any[];
}) {
  const [open, setOpen] = useState(false);
  const [empFilter, setEmpFilter] = useState("all");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const handleExport = () => {
    const filtered = leads.filter((l) => {
      const matchEmp = empFilter === "all" || l.employee_id === empFilter;
      const created = new Date(l.created_at);
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T23:59:59");
      return matchEmp && created >= start && created <= end;
    });
    const name =
      empFilter !== "all"
        ? (profileMap[empFilter]?.name ?? "employee").replace(/\s+/g, "_")
        : "all_employees";
    const ts = new Date().toISOString().slice(0, 10);
    exportToCSV(filtered, profileMap, `leads_${name}_${ts}.csv`);
    toast.success(`Exported ${filtered.length} leads to CSV`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2 h-9 text-sm">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            Export Leads to CSV
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Employee</Label>
            <Select value={empFilter} onValueChange={setEmpFilter}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name || e.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Start Date</Label>
              <Input type="date" value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl h-10" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">End Date</Label>
              <Input type="date" value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl h-10" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Exports matching leads as a .csv file you can open in Excel.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleExport} className="rounded-xl gap-2">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── AddLeadDialog ────────────────────────────────────────────────────────────

function AddLeadDialog({
  isElevated,
  employees,
  onCreated,
  userId,
}: {
  isElevated: boolean;
  employees: any[];
  onCreated: () => void;
  userId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [assignTo, setAssignTo] = useState("");

  const create = async () => {
    if (!userId || !form.name || !form.phone)
      return toast.error("Name and phone are required");
    const empId = isElevated && assignTo ? assignTo : userId;
    const { error } = await supabase.from("leads").insert({
      employee_id: empId,
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      property_interest: form.property_interest || null,
      budget: form.budget || null,
      address: form.address || null,
      source: form.source || null,
      priority: form.priority || null,
      status: form.status,
      notes: form.notes || null,
      follow_up_date: form.follow_up_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Lead added successfully");
    setOpen(false);
    setForm(emptyForm);
    setAssignTo("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-2 h-9 text-sm">
          <Plus className="h-3.5 w-3.5" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader><DialogTitle>New Lead</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="Lead name" />
            </div>
            <div>
              <Label className="text-xs">Phone *</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="+91 xxxxx xxxxx" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="email@example.com" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Property Interest</Label>
              <Input value={form.property_interest} onChange={(e) => setForm({ ...form, property_interest: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="2BHK, Plot, Villa…" />
            </div>
            <div>
              <Label className="text-xs">Budget</Label>
              <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="e.g. 50L, 1Cr" />
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="mt-1 rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
                <SelectTrigger className="mt-1 rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger className="mt-1 rounded-xl h-10"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 rounded-xl h-10" placeholder="Location / area" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Follow-up Date</Label>
              <Input type="date" value={form.follow_up_date}
                onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                className="mt-1 rounded-xl h-10" />
            </div>
            {isElevated && employees.length > 0 && (
              <div className="col-span-2">
                <Label className="text-xs">Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger className="mt-1 rounded-xl h-10">
                    <SelectValue placeholder="Select employee…" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name || e.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2">
              <Label className="text-xs">Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 rounded-xl resize-none" rows={3} placeholder="Any additional details…" />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
          <Button onClick={create} className="rounded-xl">Create Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── TransferLeadsDialog ──────────────────────────────────────────────────────

function TransferLeadsDialog({
  isElevated,
  employees,
  leads,
  onTransferred,
}: {
  isElevated: boolean;
  employees: any[];
  leads: any[];
  onTransferred: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"single" | "date" | "status">("single");
  const [fromEmp, setFromEmp] = useState("");
  const [toEmp, setToEmp] = useState("");

  // Single mode
  const [selectedLeadId, setSelectedLeadId] = useState("");

  // Date mode
  const [targetDate, setTargetDate] = useState("");

  // Status/Priority mode
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [isTransferring, setIsTransferring] = useState(false);

  // Derived available leads for "From" employee
  const fromEmpLeads = useMemo(() => leads.filter((l) => l.employee_id === fromEmp), [leads, fromEmp]);

  // Derived matching leads based on mode
  const matchingLeads = useMemo(() => {
    if (!fromEmp) return [];
    if (mode === "single") {
      return fromEmpLeads.filter((l) => l.id.toString() === selectedLeadId);
    } else if (mode === "date") {
      if (!targetDate) return [];
      return fromEmpLeads.filter((l) => {
        if (!l.created_at) return false;
        const d = new Date(l.created_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}` === targetDate;
      });
    } else if (mode === "status") {
      let filtered = fromEmpLeads;
      if (statusFilter !== "all") filtered = filtered.filter((l) => l.status === statusFilter);
      if (priorityFilter !== "all") filtered = filtered.filter((l) => l.priority === priorityFilter);
      return filtered;
    }
    return [];
  }, [mode, fromEmp, fromEmpLeads, selectedLeadId, targetDate, statusFilter, priorityFilter]);

  const handleTransfer = async () => {
    if (!fromEmp || !toEmp) return toast.error("Please select both From and To employees");
    if (fromEmp === toEmp) return toast.error("Cannot transfer to the same employee");
    if (matchingLeads.length === 0) return toast.error("No leads match the selected criteria");

    setIsTransferring(true);

    // Perform bulk update
    const leadIds = matchingLeads.map((l) => l.id);
    const { error } = await supabase
      .from("leads")
      .update({ employee_id: toEmp, updated_at: new Date().toISOString() })
      .in("id", leadIds);

    setIsTransferring(false);

    if (error) return toast.error(error.message);

    toast.success(`Successfully transferred ${leadIds.length} lead(s)`);
    setOpen(false);

    // Reset forms
    setFromEmp("");
    setToEmp("");
    setSelectedLeadId("");
    setTargetDate("");
    setStatusFilter("all");
    setPriorityFilter("all");

    onTransferred();
  };

  if (!isElevated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl gap-2 h-9 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200">
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Transfer Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-700">
            <ArrowRightLeft className="h-4 w-4" />
            Transfer Leads
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Transfer Mode Segmented Control */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(["single", "date", "status"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setSelectedLeadId("");
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                  mode === m
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {m === "single" ? "Single Lead" : m === "date" ? "By Date" : "By Status"}
              </button>
            ))}
          </div>

          {/* From & To Employees */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label className="text-xs mb-1.5 block">Transfer From</Label>
              <Select value={fromEmp} onValueChange={(v) => { setFromEmp(v); setSelectedLeadId(""); }}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name || e.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Transfer To</Label>
              <Select value={toEmp} onValueChange={setToEmp}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id} disabled={e.id === fromEmp}>
                      {e.name || e.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Mode specific fields */}
          <div className="min-h-[100px]">
            {mode === "single" && (
              <div className="space-y-2">
                <Label className="text-xs block">Select Lead</Label>
                <Select value={selectedLeadId} onValueChange={setSelectedLeadId} disabled={!fromEmp}>
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder={fromEmp ? "Select a lead..." : "Select 'From' employee first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {fromEmpLeads.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">No leads available</div>
                    ) : (
                      fromEmpLeads.map((l) => (
                        <SelectItem key={l.id} value={l.id.toString()}>
                          {l.name} {l.phone ? `(${l.phone})` : ""} - {STATUS_LABEL[l.status as LeadStatus] ?? l.status}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "date" && (
              <div className="space-y-2">
                <Label className="text-xs block">Lead Creation Date</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="rounded-xl h-10"
                  disabled={!fromEmp}
                />
                <p className="text-[11px] text-muted-foreground">
                  All leads created on this date by the selected employee will be transferred.
                </p>
              </div>
            )}

            {mode === "status" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Status</Label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} disabled={!fromEmp}>
                    <SelectTrigger className="rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Status</SelectItem>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter} disabled={!fromEmp}>
                    <SelectTrigger className="rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Priority</SelectItem>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p} className="capitalize">
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Transfer Summary Preview */}
          {fromEmp && (
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="text-sm font-medium text-indigo-900 flex justify-between items-center">
                <span>Transfer Summary</span>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                  {matchingLeads.length} Lead{matchingLeads.length !== 1 ? "s" : ""} Selected
                </Badge>
              </div>
              {matchingLeads.length > 0 && matchingLeads.length <= 3 && (
                <ul className="mt-2 text-xs text-indigo-700 space-y-1">
                  {matchingLeads.map((l) => (
                    <li key={l.id} className="truncate">
                      • {l.name} {l.phone ? `(${l.phone})` : ""}
                    </li>
                  ))}
                </ul>
              )}
              {matchingLeads.length > 3 && (
                <div className="mt-2 text-xs text-indigo-700">
                  • {matchingLeads[0].name} <br />
                  • {matchingLeads[1].name} <br />
                  • and {matchingLeads.length - 2} more...
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            className="rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
            disabled={isTransferring || !fromEmp || !toEmp || matchingLeads.length === 0}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            {isTransferring
              ? "Transferring..."
              : `Transfer ${matchingLeads.length > 0 ? matchingLeads.length : ""} Lead${
                  matchingLeads.length !== 1 ? "s" : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── QuickTransferDialog ──────────────────────────────────────────────────────

function QuickTransferDialog({
  lead,
  employees,
  onClose,
  onTransferred,
}: {
  lead: any | null;
  employees: any[];
  onClose: () => void;
  onTransferred: () => void;
}) {
  const [toEmp, setToEmp] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    if (lead) setToEmp("");
  }, [lead]);

  const handleTransfer = async () => {
    if (!toEmp) return toast.error("Select an employee");
    setIsTransferring(true);
    const { error } = await supabase
      .from("leads")
      .update({ employee_id: toEmp, updated_at: new Date().toISOString() })
      .eq("id", lead.id);
    setIsTransferring(false);
    if (error) return toast.error(error.message);
    toast.success("Lead transferred successfully");
    onTransferred();
    onClose();
  };

  return (
    <Dialog open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            Transfer Lead
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-xs mb-1.5 block">Transferring:</Label>
            <div className="font-semibold text-sm">{lead?.name}</div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Transfer To Employee</Label>
            <Select value={toEmp} onValueChange={setToEmp}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id} disabled={e.id === lead?.employee_id}>
                    {e.name || e.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!toEmp || isTransferring} className="rounded-xl gap-2">
            <ArrowRightLeft className="h-3.5 w-3.5" />
            {isTransferring ? "Transferring..." : "Transfer Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── LeadCard (kanban) ────────────────────────────────────────────────────────

function LeadCard({
  l, profileMap, isElevated, onStatusChange, onClick, onTransferClick
}: {
  l: any;
  profileMap: Record<string, any>;
  isElevated: boolean;
  onStatusChange: (id: number, s: LeadStatus) => void;
  onClick: () => void;
  onTransferClick?: (lead: any) => void;
}) {
  const status = l.status as LeadStatus;
  return (
    <Card className="p-3 rounded-xl bg-card hover:shadow-md transition-all cursor-pointer border border-border/50"
      onClick={onClick}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex flex-col">
          <div className="font-semibold text-sm leading-tight">{l.name}</div>
          {l.created_at && (
            <div className="text-[9px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {new Date(l.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>
        {l.priority && (
          <span className={`text-[10px] font-bold uppercase ${PRIORITY_COLOR[l.priority] ?? "text-muted-foreground"} whitespace-nowrap`}>
            {l.priority === "hot" && <Flame className="h-2.5 w-2.5 inline mr-0.5" />}
            {l.priority}
          </span>
        )}
      </div>
      {l.property_interest && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Building2 className="h-3 w-3 shrink-0" />{l.property_interest}
        </div>
      )}
      {l.phone && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <Phone className="h-3 w-3 shrink-0" />{l.phone}
        </div>
      )}
      {l.budget && (
        <div className="text-xs font-medium text-primary mt-1">₹{l.budget}</div>
      )}
      {l.follow_up_date && (
        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
          <Calendar className="h-2.5 w-2.5" />
          {new Date(l.follow_up_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </div>
      )}
      {isElevated && profileMap[l.employee_id] && (
        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border/40">
          <User className="h-3 w-3" />{profileMap[l.employee_id].name || profileMap[l.employee_id].email}
        </div>
      )}
      {isElevated && (
        <div className="flex gap-1 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {STATUSES.filter((s) => s !== status).slice(0, 3).map((next) => (
            <button key={next} onClick={() => onStatusChange(l.id, next)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
              → {STATUS_LABEL[next]}
            </button>
          ))}
          {onTransferClick && (
            <button onClick={() => onTransferClick(l)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center gap-1">
              <ArrowRightLeft className="h-3 w-3" /> Transfer
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── LeadDetailDialog ─────────────────────────────────────────────────────────

function LeadDetailDialog({
  lead, profileMap, isElevated, onClose, onTransferClick
}: {
  lead: any | null;
  profileMap: Record<string, any>;
  isElevated: boolean;
  onClose: () => void;
  onTransferClick?: (lead: any) => void;
}) {
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (lead) setActiveTab("info");
  }, [lead]);

  if (!lead) return null;
  const status = lead.status as LeadStatus;
  
  const initialsStr = lead.name ? lead.name.trim().split(/\s+/).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "?";

  // Creative location handling without DB changes:
  const hasGps = lead.lat || lead.lng || lead.latitude || lead.longitude;
  const lat = lead.lat || lead.latitude;
  const lng = lead.lng || lead.longitude;

  return (
    <Dialog open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden bg-[#F8FAFC] border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[32px] sm:rounded-[32px]">
        {/* Beautiful Gradient Header */}
        <div className="relative pt-8 pb-6 px-6 bg-white flex flex-col items-center rounded-b-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 border-b border-slate-100">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white -z-10" />
          
          <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-black mb-3 shadow-[0_4px_20px_rgb(59,130,246,0.15)] border-4 border-white">
            {initialsStr}
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{lead.name}</h2>
          
          <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
            <span className={`inline-flex items-center text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${STATUS_COLOR[status] ?? "bg-slate-100 text-slate-700"}`}>
              {STATUS_LABEL[status] ?? status}
            </span>
            <span className={`inline-flex items-center text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${PRIORITY_BG[lead.priority] ?? "bg-slate-100 text-slate-500 border-transparent"}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${PRIORITY_COLOR[lead.priority] ? PRIORITY_COLOR[lead.priority].replace('text-', 'bg-') : 'bg-slate-400'}`}></span>
              {lead.priority || "Normal"}
            </span>
            {lead.created_at && (
              <span className="inline-flex items-center text-[11px] px-3 py-1 rounded-full font-bold tracking-wider bg-slate-50 text-slate-500 border border-slate-200 shadow-sm">
                <Clock className="h-3 w-3 mr-1.5 text-slate-400" />
                {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>

          <div className="flex gap-4 justify-center w-full px-4">
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all hover:-translate-y-1" onClick={() => lead.phone && window.open(`tel:${lead.phone}`)}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-1" onClick={() => lead.email && window.open(`mailto:${lead.email}`)}>
              <Mail className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-1" onClick={() => setActiveTab("meetings")}>
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:-translate-y-1" onClick={() => setActiveTab("docs")}>
              <Paperclip className="h-5 w-5" />
            </Button>
            {isElevated && onTransferClick && (
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm transition-all hover:-translate-y-1" onClick={() => { onTransferClick(lead); onClose(); }}>
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex p-1 bg-slate-200/50 rounded-2xl">
            {["info", "meetings", "timeline", "docs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[12px] font-bold rounded-xl capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-8 pt-3 max-h-[45vh] overflow-y-auto no-scrollbar">
          {activeTab === "info" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              
              {/* Grid for small metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60">
                  <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Phone className="h-3 w-3" /> Phone</div>
                  <div className="text-[15px] font-black text-slate-800">{lead.phone || "—"}</div>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60 overflow-hidden">
                  <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</div>
                  <div className="text-[14px] font-bold text-slate-800 truncate" title={lead.email}>{lead.email || "—"}</div>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60">
                  <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Building2 className="h-3 w-3" /> Property</div>
                  <div className="text-[15px] font-black text-slate-800">{lead.property_interest || "—"}</div>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60">
                  <div className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><IndianRupee className="h-3 w-3" /> Budget</div>
                  <div className="text-[15px] font-black text-emerald-600">{lead.budget ? `₹${lead.budget}` : "—"}</div>
                </div>
              </div>

              {/* Full width cards */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60 flex items-start gap-3">
                <div className="mt-0.5"><MapPin className="h-5 w-5 text-orange-400" /></div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Address</div>
                  <div className="text-[14px] font-bold text-slate-800 leading-tight">{lead.address || "No address provided"}</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60 flex items-start gap-3">
                <div className="mt-0.5"><MapPinned className="h-5 w-5 text-red-400" /></div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">GPS Location</div>
                  {hasGps ? (
                    <>
                      <div className="text-[14px] font-bold text-slate-800">{lat}, {lng}</div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noreferrer" className="text-[12px] text-blue-600 font-bold mt-1.5 inline-block hover:underline">
                        View on Maps →
                      </a>
                    </>
                  ) : (
                    <div className="text-[14px] font-bold text-slate-400">Waiting for mobile sync</div>
                  )}
                </div>
              </div>

              {isElevated && profileMap[lead.employee_id] && (
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/60 flex items-start gap-3">
                  <div className="mt-0.5"><User className="h-5 w-5 text-cyan-500" /></div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Assigned Rep</div>
                    <div className="text-[14px] font-bold text-slate-800">
                      {profileMap[lead.employee_id]?.name || profileMap[lead.employee_id]?.email}
                    </div>
                  </div>
                </div>
              )}

              {lead.notes && (
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100/60">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Notes</div>
                  <div className="text-[14px] font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                    {lead.notes}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "meetings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No Meetings Yet</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 max-w-[250px]">Schedule a site visit or call to move this lead forward.</p>
              <Button className="rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.2)] bg-blue-600 hover:bg-blue-700 font-bold px-8 h-12">
                Schedule Meeting
              </Button>
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 px-2">
              <div className="relative pl-7 border-l-[3px] border-slate-200 space-y-8">
                {lead.updated_at !== lead.created_at && (
                  <div className="relative">
                    <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-[#F8FAFC] shadow-sm" />
                    <div className="text-sm font-black text-slate-800">Status Updated</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{new Date(lead.updated_at).toLocaleString("en-IN")}</div>
                    <div className="text-sm font-medium text-slate-600 mt-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60">
                      Moved to <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${STATUS_COLOR[status] ?? "bg-slate-100 text-slate-700"}`}>{STATUS_LABEL[status] ?? status}</span>
                    </div>
                  </div>
                )}
                <div className="relative">
                  <div className="absolute -left-[35px] bg-blue-500 w-4 h-4 rounded-full border-4 border-[#F8FAFC] shadow-sm" />
                  <div className="text-sm font-black text-slate-800">Lead Created</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{new Date(lead.created_at).toLocaleString("en-IN")}</div>
                  <div className="text-sm font-medium text-slate-600 mt-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60">
                    Added to system via <span className="capitalize font-bold text-slate-800">{lead.source ? lead.source.replace(/_/g, " ") : "manual entry"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "docs" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No Documents</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 max-w-[250px]">Upload KYC, brochures, or quotations safely here.</p>
              <Button variant="outline" className="rounded-full border-slate-200 font-bold px-8 h-12 shadow-sm text-indigo-600 hover:bg-indigo-50">
                Upload File
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── KanbanView ───────────────────────────────────────────────────────────────

function KanbanView({
  leads, profileMap, isElevated, statusFilter, onStatusChange, onSelectLead, onTransferClick
}: {
  leads: any[];
  profileMap: Record<string, any>;
  isElevated: boolean;
  statusFilter: LeadStatus | "all";
  onStatusChange: (id: number, s: LeadStatus) => void;
  onSelectLead: (l: any) => void;
  onTransferClick?: (lead: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      {STATUSES.filter((s) => statusFilter === "all" || s === statusFilter).map((s, i) => {
        const items = leads.filter((l) => l.status === s);
        return (
          <motion.div key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="p-3 rounded-2xl bg-muted/20 border-border/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[s]}`}>
                  {STATUS_LABEL[s]}
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.length === 0 && (
                  <div className="text-xs text-muted-foreground py-6 text-center">No leads</div>
                )}
                {items.map((l) => (
                  <LeadCard key={l.id} l={l} profileMap={profileMap} isElevated={isElevated}
                    onStatusChange={onStatusChange} onClick={() => onSelectLead(l)} onTransferClick={onTransferClick} />
                ))}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── TableView ────────────────────────────────────────────────────────────────

function TableView({
  leads, profileMap, isElevated, onStatusChange, onSelectLead, onTransferClick
}: {
  leads: any[];
  profileMap: Record<string, any>;
  isElevated: boolean;
  onStatusChange: (id: number, s: LeadStatus) => void;
  onSelectLead: (l: any) => void;
  onTransferClick?: (lead: any) => void;
}) {
  return (
    <Card className="rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {["Name", "Phone", "Property", "Budget", "Priority", "Status", "Source", "Assigned To", "Created On", "Follow-up", "Move To"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.length === 0 && (
              <tr><td colSpan={10} className="py-10 text-center text-muted-foreground text-sm">No leads found</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onSelectLead(l)}>
                <td className="px-4 py-3">
                  <div className="font-medium">{l.name}</div>
                  {l.email && <div className="text-xs text-muted-foreground">{l.email}</div>}
                </td>
                <td className="px-4 py-3 text-sm">{l.phone}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{l.property_interest || "—"}</td>
                <td className="px-4 py-3 text-sm font-medium text-primary">{l.budget ? `₹${l.budget}` : "—"}</td>
                <td className="px-4 py-3">
                  {l.priority ? (
                    <span className={`text-xs font-bold uppercase ${PRIORITY_COLOR[l.priority] ?? ""}`}>
                      {l.priority}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[l.status as LeadStatus] ?? ""}`}>
                    {STATUS_LABEL[l.status as LeadStatus] ?? l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                  {l.source?.replace(/_/g, " ") || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {profileMap[l.employee_id]?.name || profileMap[l.employee_id]?.email || "—"}
                </td>
                <td className="px-4 py-3">
                  {l.created_at ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100/60 px-2 py-1 rounded-lg border border-slate-200/60 shadow-sm whitespace-nowrap">
                      <Clock className="h-3 w-3 text-blue-400" />
                      {new Date(l.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {l.follow_up_date ? new Date(l.follow_up_date).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Select onValueChange={(v) => onStatusChange(l.id, v as LeadStatus)}>
                      <SelectTrigger className="h-7 text-xs rounded-lg w-32 border-dashed">
                        <SelectValue placeholder="Move to…" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.filter((s) => s !== l.status).map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{STATUS_LABEL[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isElevated && onTransferClick && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50" onClick={() => onTransferClick(l)}>
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── TeamsView ────────────────────────────────────────────────────────────────

function TeamsView({
  leads, managers, employees, onSelectManager, onViewAll,
}: {
  leads: any[];
  managers: any[];
  employees: any[];
  onSelectManager: (m: any) => void;
  onViewAll: () => void;
}) {
  const total = leads.length;
  const open = leads.filter((l) => l.status !== "closed_won" && l.status !== "closed_lost").length;
  const won = leads.filter((l) => l.status === "closed_won").length;
  const hot = leads.filter((l) => l.priority === "hot").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: total, color: "text-primary", bg: "bg-primary/10" },
          { label: "Open", value: open, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Hot Leads", value: hot, color: "text-red-500", bg: "bg-red-50" },
          { label: "Closed Won", value: won, color: "text-green-600", bg: "bg-green-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 rounded-2xl">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View all shortcut */}
      <button onClick={onViewAll}
        className="w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
        <Layers className="h-5 w-5 text-primary" />
        <div>
          <div className="text-sm font-semibold text-primary">View All Leads</div>
          <div className="text-xs text-muted-foreground">See every lead across all teams in one view</div>
        </div>
        <ChevronRight className="h-4 w-4 text-primary ml-auto" />
      </button>

      {/* Manager teams */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Teams — tap to drill down
        </p>
        <div className="space-y-3">
          {managers.length === 0 && (
            <Card className="p-8 rounded-2xl text-center text-muted-foreground text-sm">
              No managers found. Assign the <span className="font-medium">manager</span> role to profiles in Supabase.
            </Card>
          )}
          {managers.map((mgr) => {
            // Employees under this manager (manager_id = mgr.id) plus the manager themselves
            const teamEmpIds = employees
              .filter((e) => e.manager_id === mgr.id)
              .map((e) => e.id);
            const allIds = [mgr.id, ...teamEmpIds];
            const teamLeads = leads.filter((l) => allIds.includes(l.employee_id));
            const teamWon = teamLeads.filter((l) => l.status === "closed_won").length;
            const teamHot = teamLeads.filter((l) => l.priority === "hot").length;
            const pct = total > 0 ? Math.round((teamLeads.length / total) * 100) : 0;

            return (
              <motion.div key={mgr.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all border-l-4 border-l-violet-400"
                  onClick={() => onSelectManager(mgr)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <span className="text-violet-700 font-bold text-sm">{initials(mgr.name || mgr.email)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{mgr.name || mgr.email}'s Team</div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />{teamEmpIds.length} employee{teamEmpIds.length !== 1 ? "s" : ""}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />{teamLeads.length} lead{teamLeads.length !== 1 ? "s" : ""}
                        </span>
                        {teamHot > 0 && (
                          <span className="flex items-center gap-1 text-red-500">
                            <Flame className="h-3 w-3" />{teamHot} hot
                          </span>
                        )}
                        {teamWon > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Trophy className="h-3 w-3" />{teamWon} won
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-violet-600">{pct}%</div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Unassigned leads */}
          {(() => {
            const assignedIds = managers.flatMap((mgr) => {
              const teamIds = employees.filter((e) => e.manager_id === mgr.id).map((e) => e.id);
              return [mgr.id, ...teamIds];
            });
            const unassigned = leads.filter((l) => !assignedIds.includes(l.employee_id));
            if (unassigned.length === 0) return null;
            return (
              <Card className="p-4 rounded-2xl border-dashed border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <span className="text-muted-foreground font-bold text-sm">?</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-muted-foreground">Unassigned / No Team</div>
                    <div className="text-xs text-muted-foreground">{unassigned.length} lead{unassigned.length !== 1 ? "s" : ""} with no manager assigned</div>
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── EmployeesView ────────────────────────────────────────────────────────────

function EmployeesView({
  manager, leads, employees, onBack, onSelectEmployee,
}: {
  manager: any;
  leads: any[];
  employees: any[];
  onBack: () => void;
  onSelectEmployee: (e: any) => void;
}) {
  const teamEmps = employees.filter((e) => e.manager_id === manager.id);
  const allIds = [manager.id, ...teamEmps.map((e) => e.id)];
  const teamLeads = leads.filter((l) => allIds.includes(l.employee_id));

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />Teams
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{manager.name || manager.email}'s Team</span>
      </div>

      {/* Hero */}
      <Card className="p-4 rounded-2xl border-l-4 border-l-violet-400">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
            <span className="text-violet-700 font-bold">{initials(manager.name || manager.email)}</span>
          </div>
          <div>
            <div className="font-bold">{manager.name || manager.email}'s Team</div>
            <div className="text-xs text-muted-foreground">
              {teamEmps.length} employee{teamEmps.length !== 1 ? "s" : ""} · {teamLeads.length} lead{teamLeads.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </Card>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Tap an employee to see their leads
      </p>

      <div className="space-y-2">
        {teamEmps.length === 0 && (
          <Card className="p-8 rounded-2xl text-center text-muted-foreground text-sm">
            No employees assigned to this manager yet.
          </Card>
        )}
        {teamEmps.map((emp) => {
          const empLeads = leads.filter((l) => l.employee_id === emp.id);
          const openCount = empLeads.filter((l) => l.status !== "closed_won" && l.status !== "closed_lost").length;
          const wonCount = empLeads.filter((l) => l.status === "closed_won").length;
          const hotCount = empLeads.filter((l) => l.priority === "hot").length;

          return (
            <motion.div key={emp.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => onSelectEmployee(emp)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 font-bold text-xs">{initials(emp.name || emp.email)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{emp.name || emp.email}</div>
                    {emp.designation && <div className="text-xs text-muted-foreground">{emp.designation}</div>}
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {hotCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          🔥 {hotCount} hot
                        </span>
                      )}
                      {openCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {openCount} open
                        </span>
                      )}
                      {wonCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          🏆 {wonCount} won
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-primary">{empLeads.length}</div>
                    <div className="text-[10px] text-muted-foreground">leads</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main LeadsPage ───────────────────────────────────────────────────────────

function LeadsPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "hr") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [role, navigate]);

  const isElevated = role === "admin" || role === "super_admin" || role === "manager";
  const isAdminOrHR = role === "admin" || role === "super_admin" || role === "hr";
  const isManager = role === "manager";

  const [leads, setLeads] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Admin drill-down
  const [adminLevel, setAdminLevel] = useState<AdminLevel>(isManager ? "employees" : "teams");
  const [selectedManager, setSelectedManager] = useState<any | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Lead detail
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [quickTransferLead, setQuickTransferLead] = useState<any | null>(null);

  // ── Load data ─────────────────────────────────────────────────────────────

  const load = async () => {
    setLoading(true);
    let allLeads: any[] = [];
    let start = 0;
    const step = 1000;

    while (true) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .range(start, start + step - 1);
      
      if (error) { 
        toast.error(error.message); 
        setLoading(false); 
        return; 
      }
      
      if (data) allLeads = allLeads.concat(data);
      if (!data || data.length < step) break;
      start += step;
    }

    setLeads(allLeads);

    // Build profileMap from all employee_ids
    const ids = [...new Set(allLeads.map((l: any) => l.employee_id).filter(Boolean))] as string[];
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, name, email, designation, manager_id, role")
        .in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      setProfileMap(map);
    }
    setLoading(false);
  };

  const loadPeople = async () => {
    if (!isElevated) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, name, email, designation, manager_id, role")
      .order("name");
    const all = data ?? [];
    setEmployees(all);
    // Managers = anyone with role 'manager', or admins who manage people
    setManagers(all.filter((p: any) => p.role === "manager"));
    
    // If the user is a manager, automatically set them as the selected manager
    if (role === "manager" && user) {
      const selfProfile = all.find((p: any) => p.id === user.id);
      if (selfProfile) {
        setSelectedManager(selfProfile);
      }
    }
  };

  useEffect(() => { load(); loadPeople(); }, []);

  // ── Status update ─────────────────────────────────────────────────────────

  const updateStatus = async (id: number, status: LeadStatus) => {
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success("Status updated");
  };

  // ── Filtered leads ────────────────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    let base = leads;

    // Employee sees only their own
    if (!isElevated && user) base = base.filter((l) => l.employee_id === user.id);

    // Manager sees only their team
    if (role === "manager" && user) {
      const teamIds = employees.filter((e) => e.manager_id === user.id).map((e) => e.id);
      base = base.filter((l) => teamIds.includes(l.employee_id) || l.employee_id === user.id);
    }

    // Drill-down: employee level
    if (adminLevel === "leads" && selectedEmployee) {
      base = base.filter((l) => l.employee_id === selectedEmployee.id);
    }

    // Search
    if (q) {
      const ql = q.toLowerCase();
      base = base.filter((l) =>
        [l.name, l.phone, l.email, l.property_interest, l.address, l.budget]
          .some((v) => v?.toLowerCase().includes(ql))
      );
    }

    if (statusFilter !== "all") base = base.filter((l) => l.status === statusFilter);
    if (priorityFilter !== "all") base = base.filter((l) => l.priority === priorityFilter);
    if (dateFilter) {
      base = base.filter((l) => {
        if (!l.created_at) return false;
        const d = new Date(l.created_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}` === dateFilter;
      });
    }

    return base;
  }, [leads, q, statusFilter, priorityFilter, dateFilter, adminLevel, selectedEmployee, isElevated, role, user, employees]);

  const stats = {
    total: filteredLeads.length,
    open: filteredLeads.filter((l) => l.status !== "closed_won" && l.status !== "closed_lost").length,
    won: filteredLeads.filter((l) => l.status === "closed_won").length,
  };

  // Whether to show the leads list view
  const showLeadsView = !isElevated || adminLevel === "all" || adminLevel === "leads";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <PageHeader
        title="Leads CRM"
        subtitle={isElevated ? `${leads.length} leads across your team` : "Your pipeline"}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            {(showLeadsView || !isElevated) && (
              <div className="flex rounded-xl border overflow-hidden text-xs">
                {(["kanban", "table"] as const).map((m) => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`px-3 py-2 font-medium transition-colors flex items-center gap-1.5 ${viewMode === m ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                    {m === "kanban" ? <LayoutGrid className="h-3 w-3" /> : <Table2 className="h-3 w-3" />}
                    {m === "kanban" ? "Kanban" : "Table"}
                  </button>
                ))}
              </div>
            )}
            {/* Export — elevated only */}
            {isElevated && (
              <>
                <TransferLeadsDialog isElevated={isElevated} employees={employees} leads={leads} onTransferred={load} />
                <ExportDialog leads={leads} profileMap={profileMap} employees={employees} />
              </>
            )}
            <AddLeadDialog isElevated={isElevated} employees={employees} onCreated={load} userId={user?.id} />
          </div>
        }
      />

      {/* ── Admin/HR: Teams level ── */}
      {isAdminOrHR && adminLevel === "teams" && (
        <AnimatePresence mode="wait">
          <motion.div key="teams" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <TeamsView
              leads={leads}
              managers={managers}
              employees={employees}
              onSelectManager={(mgr) => { setSelectedManager(mgr); setAdminLevel("employees"); }}
              onViewAll={() => setAdminLevel("all")}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Elevated: Employees level ── */}
      {isElevated && adminLevel === "employees" && selectedManager && (
        <AnimatePresence mode="wait">
          <motion.div key="employees" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <EmployeesView
              manager={selectedManager}
              leads={leads}
              employees={employees}
              onBack={() => { 
                if (isManager) {
                  // Managers can't go back to teams view
                  return;
                }
                setAdminLevel("teams"); 
                setSelectedManager(null); 
              }}
              onSelectEmployee={(emp) => { setSelectedEmployee(emp); setAdminLevel("leads"); }}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Leads list view (admin "all" / drill-down "leads" / non-admin) ── */}
      {showLeadsView && (
        <AnimatePresence mode="wait">
          <motion.div key="leads-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">

            {/* Breadcrumb for drill-down */}
            {isElevated && adminLevel === "leads" && selectedEmployee && (
              <div className="flex items-center gap-2 text-sm flex-wrap">
                {isAdminOrHR && (
                  <>
                    <button onClick={() => { setAdminLevel("teams"); setSelectedManager(null); setSelectedEmployee(null); }}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                      <ArrowLeft className="h-3.5 w-3.5" />Teams
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </>
                )}
                {isManager && (
                  <button onClick={() => { setAdminLevel("employees"); setSelectedEmployee(null); }}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />My Team
                  </button>
                )}
                {!isManager && (
                  <button onClick={() => { setAdminLevel("employees"); setSelectedEmployee(null); }}
                    className="text-muted-foreground hover:text-foreground transition-colors">
                    {selectedManager?.name}'s Team
                  </button>
                )}
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{selectedEmployee.name || selectedEmployee.email}</span>
              </div>
            )}

            {/* "All leads" back button */}
            {isAdminOrHR && adminLevel === "all" && (
              <button onClick={() => setAdminLevel("teams")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />Back to Teams
              </button>
            )}

            {/* Employee hero card in drill-down */}
            {isElevated && adminLevel === "leads" && selectedEmployee && (
              <Card className="p-4 rounded-2xl border-l-4 border-l-blue-400">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm">{initials(selectedEmployee.name || selectedEmployee.email)}</span>
                    </div>
                    <div>
                      <div className="font-bold">{selectedEmployee.name || selectedEmployee.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedEmployee.designation || "Employee"} · {leads.filter((l) => l.employee_id === selectedEmployee.id).length} total leads
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs"
                    onClick={() => {
                      const empLeads = leads.filter((l) => l.employee_id === selectedEmployee.id);
                      const ts = new Date().toISOString().slice(0, 10);
                      const name = (selectedEmployee.name || "employee").replace(/\s+/g, "_");
                      exportToCSV(empLeads, profileMap, `leads_${name}_${ts}.csv`);
                      toast.success(`Exported ${empLeads.length} leads`);
                    }}>
                    <Download className="h-3 w-3" />Export
                  </Button>
                </div>
              </Card>
            )}

            {/* Stats */}
            {isElevated && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: stats.total, color: "text-primary" },
                  { label: "Open", value: stats.open, color: "text-amber-600" },
                  { label: "Closed Won", value: stats.won, color: "text-green-600" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-4 rounded-2xl text-center">
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-44 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, phone, property…" className="pl-8 rounded-xl h-9 text-sm" />
                {q && (
                  <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              
              {/* Date Filter */}
              <div className="relative group">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground z-10">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <Input 
                  type="date" 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  onClick={(e) => {
                    try {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        (e.target as HTMLInputElement).showPicker();
                      }
                    } catch (err) {}
                  }}
                  className="pl-8 pr-8 rounded-xl h-9 text-xs w-[140px] transition-all focus:w-[150px] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                  title="Filter by creation date"
                />
                {dateFilter && (
                  <button onClick={() => setDateFilter("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 bg-background rounded-full transition-colors z-10">
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="rounded-xl h-9 w-36 text-xs">
                  <Filter className="h-3 w-3 mr-1" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="rounded-xl h-9 w-28 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="rounded-xl h-9 gap-1.5 text-xs">
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
              </Button>
            </div>

            {/* Content */}
            {viewMode === "kanban" ? (
              <KanbanView leads={filteredLeads} profileMap={profileMap} isElevated={isElevated}
                statusFilter={statusFilter} onStatusChange={updateStatus} onSelectLead={setSelectedLead} onTransferClick={setQuickTransferLead} />
            ) : (
              <TableView leads={filteredLeads} profileMap={profileMap} isElevated={isElevated}
                onStatusChange={updateStatus} onSelectLead={setSelectedLead} onTransferClick={setQuickTransferLead} />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Lead detail */}
      <LeadDetailDialog lead={selectedLead} profileMap={profileMap}
        isElevated={isElevated} onClose={() => setSelectedLead(null)} onTransferClick={setQuickTransferLead} />

      {/* Quick transfer */}
      <QuickTransferDialog lead={quickTransferLead} employees={employees} onClose={() => setQuickTransferLead(null)} onTransferred={load} />
    </>
  );
}