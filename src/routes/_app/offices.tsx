import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, MapPin, Trash2, Plus, Edit2, Check, X, Compass, ArrowLeft, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/offices")({
  component: OfficesPage,
});

function OfficesPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLat, setEditLat] = useState("");
  const [editLon, setEditLon] = useState("");
  const [editRadius, setEditRadius] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");
  const [newRadius, setNewRadius] = useState("100");

  const [assigningOffice, setAssigningOffice] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [assignedProfileIds, setAssignedProfileIds] = useState<Set<string>>(new Set());
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const loadOffices = async () => {
    setBusy(true);
    const { data, error } = await supabase.from("office_locations").select("*").order("name");
    setBusy(false);
    if (error) {
      toast.error("Failed to load offices");
    } else {
      setOffices(data || []);

      // Auto-assign any unassigned profiles to the Neelgund office (or the first office)
      const defaultOffice = data?.find(o => o.name.toLowerCase().includes("neelgund")) || data?.[0];
      if (defaultOffice) {
        supabase.from("profiles").update({ office_id: defaultOffice.id }).is("office_id", null).then();
      }
    }
  };

  useEffect(() => {
    loadOffices();
  }, []);

  const handleAdd = async () => {
    if (!newName || !newLat || !newLon || !newRadius) return toast.error("Please fill all fields");
    setBusy(true);
    const { error } = await supabase.from("office_locations").insert({
      name: newName,
      latitude: parseFloat(newLat),
      longitude: parseFloat(newLon),
      radius_meters: parseInt(newRadius, 10),
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office added successfully");
      setIsAdding(false);
      setNewName("");
      setNewLat("");
      setNewLon("");
      setNewRadius("100");
      loadOffices();
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName || !editLat || !editLon || !editRadius) return toast.error("Please fill all fields");
    setBusy(true);
    const { error } = await supabase.from("office_locations").update({
      name: editName,
      latitude: parseFloat(editLat),
      longitude: parseFloat(editLon),
      radius_meters: parseInt(editRadius, 10),
    }).eq("id", id);
    setBusy(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office updated successfully");
      setEditingId(null);
      loadOffices();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;
    setBusy(true);
    const { error } = await supabase.from("office_locations").delete().eq("id", id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Office deleted successfully");
      loadOffices();
    }
  };

  const startEdit = (office: any) => {
    setEditingId(office.id);
    setEditName(office.name);
    setEditLat(office.latitude.toString());
    setEditLon(office.longitude.toString());
    setEditRadius(office.radius_meters.toString());
    setIsAdding(false);
  };

  const openAssignDialog = async (office: any) => {
    setAssigningOffice(office);
    setLoadingProfiles(true);
    // Fetch profiles. Notice we ask for office_id. If it fails, we show an error.
    const { data, error } = await supabase.from("profiles").select("id, name, email, office_id");
    if (error) {
      toast.error("Error loading profiles. Did you run the SQL migration?");
      setAssigningOffice(null);
    } else if (data) {
      setProfiles(data);
      const assigned = new Set(data.filter(p => p.office_id === office.id).map(p => p.id));
      setAssignedProfileIds(assigned);
    }
    setLoadingProfiles(false);
  };

  const toggleAssignment = async (profile: any) => {
    const isAssigned = assignedProfileIds.has(profile.id);
    const newOfficeId = isAssigned ? null : assigningOffice.id;

    setBusy(true);
    const { error } = await supabase.from("profiles").update({ office_id: newOfficeId }).eq("id", profile.id);
    setBusy(false);

    if (error) {
      toast.error(error.message);
    } else {
      const newAssigned = new Set(assignedProfileIds);
      if (isAssigned) newAssigned.delete(profile.id);
      else newAssigned.add(profile.id);
      setAssignedProfileIds(newAssigned);

      // Update local profiles array
      setProfiles(profiles.map(p => p.id === profile.id ? { ...p, office_id: newOfficeId } : p));

      toast.success(isAssigned ? `${profile.name} removed from office` : `${profile.name} assigned to office`);
    }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader title="Office Locations" subtitle="Manage geofencing areas for attendance tracking" />

        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-5 transition-transform hover:scale-105 active:scale-95 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add New Office
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="mb-8 overflow-hidden"
          >
            <Card className="p-6 rounded-2xl border border-blue-100 shadow-lg bg-gradient-to-br from-blue-50/50 to-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Compass className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#154D8C] text-white p-2.5 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Create New Location</h3>
                    <p className="text-xs text-gray-500">Define a new geofence for employee check-ins</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Headquarters"
                      className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Geofence Radius</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newRadius}
                        onChange={e => setNewRadius(e.target.value)}
                        placeholder="100"
                        className="w-full p-3 pr-16 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">meters</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newLat}
                      onChange={e => setNewLat(e.target.value)}
                      placeholder="12.9716"
                      className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={newLon}
                      onChange={e => setNewLon(e.target.value)}
                      placeholder="77.5946"
                      className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#154D8C] focus:ring-2 focus:ring-[#154D8C]/20 transition-all shadow-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end pt-2 border-t border-blue-100/50">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl px-5 hover:bg-gray-100/80">
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={busy} className="bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl px-6 shadow-md transition-all">
                    Save Location
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {offices.map(office => (
          <motion.div
            key={office.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <Card className="h-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-gray-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group relative">
              {editingId === office.id ? (
                <div className="p-5 flex-1 flex flex-col bg-amber-50/30">
                  <div className="flex items-center gap-2 mb-4 text-amber-700 font-semibold text-sm">
                    <Edit2 className="w-4 h-4" /> Editing {office.name}
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Office Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Radius (meters)</label>
                      <input type="number" value={editRadius} onChange={e => setEditRadius(e.target.value)} className="w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Latitude</label>
                        <input type="number" step="any" value={editLat} onChange={e => setEditLat(e.target.value)} className="w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Longitude</label>
                        <input type="number" step="any" value={editLon} onChange={e => setEditLon(e.target.value)} className="w-full p-2.5 text-sm bg-white border border-amber-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-mono" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-amber-100">
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="rounded-lg text-xs bg-white hover:bg-gray-50">Cancel</Button>
                    <Button size="sm" onClick={() => handleSaveEdit(office.id)} disabled={busy} className="rounded-lg text-xs bg-amber-500 text-white hover:bg-amber-600 border-none shadow-sm"><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-2 w-full bg-gradient-to-r from-[#154D8C] to-blue-400"></div>
                  <div className="p-6 flex-1 flex flex-col relative z-10">

                    <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 z-20">
                      <button onClick={() => openAssignDialog(office)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm" title="Assign Employees">
                        <Users className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEdit(office)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm" title="Edit Office">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(office.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm" title="Delete Office">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-5">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#154D8C] shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="pt-1 flex-1 pr-12">
                        <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{office.name}</h4>
                        <div className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 border border-green-100 text-green-700 text-xs font-semibold">
                          Active Geofence
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <MapPin className="w-4 h-4 text-blue-500" /> Coordinates
                        </div>
                        <div className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                          {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Compass className="w-4 h-4 text-indigo-500" /> Radius Coverage
                        </div>
                        <div className="text-sm font-bold text-[#154D8C]">
                          {office.radius_meters} <span className="text-xs font-medium text-gray-400">meters</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual radius representation */}
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-50 rounded-full border border-blue-100/50 flex items-center justify-center opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                      <div className="w-16 h-16 bg-blue-100 rounded-full border border-blue-200/50"></div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {offices.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-gray-200 rounded-3xl shadow-sm">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-300 mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Offices Found</h3>
          <p className="text-gray-500 max-w-sm mb-6">You haven't defined any office locations for attendance geofencing yet.</p>
          <Button onClick={() => setIsAdding(true)} className="bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-6 transition-transform hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Add Your First Office
          </Button>
        </div>
      )}

      {/* Assign Employees Dialog */}
      <Dialog open={!!assigningOffice} onOpenChange={(open) => !open && setAssigningOffice(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-r from-[#154D8C] to-blue-600 p-6 text-white shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-200" />
              Assign Employees to {assigningOffice?.name}
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">
              Select employees who should be restricted to check in and out from this location.
              By default, unassigned employees fall back to the Neelgund office.
            </DialogDescription>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
            {loadingProfiles ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#154D8C]"></div>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No active employees found.</div>
            ) : (
              <div className="space-y-6">
                {/* Assigned Employees */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" /> Currently Assigned ({profiles.filter(p => assignedProfileIds.has(p.id)).length})
                  </h4>
                  {profiles.filter(p => assignedProfileIds.has(p.id)).length === 0 ? (
                    <div className="text-xs text-gray-500 bg-white p-3 rounded-xl border border-dashed">No employees assigned to this office yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profiles.filter(p => assignedProfileIds.has(p.id)).map(profile => (
                        <div key={profile.id} className="flex items-center justify-between p-3 rounded-xl border transition-all bg-blue-50 border-blue-200 shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-[#154D8C] text-white">
                              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate text-[#154D8C]">{profile.name || 'Unnamed User'}</p>
                              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                            </div>
                          </div>

                          <Button size="sm" onClick={() => toggleAssignment(profile)} disabled={busy} className="shrink-0 rounded-lg h-8 px-3 ml-2 text-xs font-semibold bg-[#154D8C] hover:bg-red-500 hover:text-white transition-colors group">
                            <span className="group-hover:hidden flex items-center"><Check className="w-3.5 h-3.5 mr-1" /> Assigned</span>
                            <span className="hidden group-hover:flex items-center"><X className="w-3.5 h-3.5 mr-1" /> Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other Employees */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> Other Employees ({profiles.filter(p => !assignedProfileIds.has(p.id)).length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profiles.filter(p => !assignedProfileIds.has(p.id)).map(profile => {
                      const isAssignedToOther = profile.office_id != null;
                      return (
                        <div key={profile.id} className="flex items-center justify-between p-3 rounded-xl border transition-all bg-white border-gray-200 hover:border-blue-300">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm bg-gray-100 text-gray-600">
                              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate text-gray-900">{profile.name || 'Unnamed User'}</p>
                              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                              {isAssignedToOther && (
                                <p className="text-[10px] text-amber-600 font-medium mt-0.5">Currently assigned to another office</p>
                              )}
                            </div>
                          </div>

                          <Button size="sm" variant="outline" onClick={() => toggleAssignment(profile)} disabled={busy} className="shrink-0 rounded-lg h-8 px-3 ml-2 text-xs font-semibold bg-white text-[#154D8C] hover:bg-blue-50 border-blue-200 hover:border-[#154D8C]">
                            <span className="flex items-center"><Plus className="w-3.5 h-3.5 mr-1" /> Assign</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex justify-end shrink-0">
            <Button onClick={() => setAssigningOffice(null)} className="rounded-xl px-6">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
