import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { FileText, UploadCloud, Download, Trash2, File as FileIcon, Search, AlertCircle, Eye, Edit3 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Neelgund Developers" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { role } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [viewingDoc, setViewingDoc] = useState<{name: string, url: string, type: string} | null>(null);
  
  // Upload flow state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploading, setUploading] = useState(false);

  // Edit flow state
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);

  const loadDocuments = async () => {
    setBusy(true);
    // Fetch directly from storage bucket
    const { data, error } = await supabase.storage.from("documents").list();
    setBusy(false);
    
    if (error) {
      toast.error("Failed to load documents: " + error.message);
    } else {
      // Filter out any hidden system files (.emptyFolderPlaceholder) and folders (like profile-photos)
      setDocuments(data?.filter(file => 
        !file.name.startsWith(".") && 
        file.name.includes(".") && // Only include actual files with extensions
        file.id !== null // Folders in Supabase typically have a null ID
      ) || []);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large (max 10MB)");
      return;
    }

    // Get name without extension
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

    setPendingFile(file);
    setUploadName(nameWithoutExt);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    if (!uploadName.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    setUploading(true);
    
    // Add extension back to the custom name
    const ext = pendingFile.name.substring(pendingFile.name.lastIndexOf('.'));
    const finalName = uploadName.trim() + ext;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(finalName, pendingFile);

    setUploading(false);

    if (storageError) {
      // If file already exists, it throws an error
      toast.error("Upload failed: " + storageError.message);
    } else {
      toast.success("Document uploaded successfully");
      setPendingFile(null);
      loadDocuments();
    }
  };

  const openEditDialog = (doc: any) => {
    setEditingDoc(doc);
    // Remove extension for editing
    const nameWithoutExt = doc.name.substring(0, doc.name.lastIndexOf('.')) || doc.name;
    setEditName(nameWithoutExt);
  };

  const saveEdit = async () => {
    if (!editingDoc || !editName.trim()) return;
    
    setEditing(true);
    
    const ext = editingDoc.name.substring(editingDoc.name.lastIndexOf('.'));
    const newFullName = editName.trim() + ext;

    if (newFullName === editingDoc.name) {
      setEditing(false);
      setEditingDoc(null);
      return;
    }

    // Move/rename file in storage
    const { error } = await supabase.storage
      .from("documents")
      .move(editingDoc.name, newFullName);
    
    setEditing(false);
    
    if (error) {
      toast.error("Failed to rename document: " + error.message);
    } else {
      toast.success("Document renamed successfully");
      setEditingDoc(null);
      loadDocuments();
    }
  };

  const handleDownload = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .download(fileName);
      
    if (error) {
      toast.error("Download failed: " + error.message);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; 
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleView = async (fileName: string) => {
    setBusy(true);
    
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);

    if (isOfficeDoc) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("documents")
        .createSignedUrl(fileName, 60 * 60);

      setBusy(false);
      
      if (signedError || !signedData) {
        toast.error("Failed to generate preview link");
        return;
      }

      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(signedData.signedUrl)}&embedded=true`;
      setViewingDoc({ name: fileName, url: viewerUrl, type: 'office' });
    } else {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(fileName);
      setBusy(false);
        
      if (error) {
        toast.error("Failed to load document preview: " + error.message);
        return;
      }

      const url = URL.createObjectURL(data);
      setViewingDoc({ name: fileName, url, type: data.type });
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    
    setBusy(true);
    const { data, error } = await supabase.storage
      .from("documents")
      .remove([fileName]);
      
    setBusy(false);
    
    if (error) {
      toast.error("Delete failed: " + error.message);
    } else if (data && data.length === 0) {
      toast.error("Delete blocked: You might not have the correct Storage RLS permissions to delete this file.");
    } else {
      toast.success("Document deleted");
      loadDocuments();
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  // Helper to drop extension for display
  const getDisplayName = (fileName: string) => {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader title="Document center" subtitle="Manage ID proofs, certificates, and contracts." />
        
        {isElevated && (
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <Button 
              onClick={handleUploadClick} 
              className="bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-6 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 ml-2 shrink-0" />
        <input 
          type="text" 
          placeholder="Search documents by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm p-1"
        />
      </div>

      {busy && documents.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-b-2 border-[#154D8C] rounded-full" />
        </div>
      ) : documents.length === 0 ? (
        <Card className="rounded-2xl p-12 flex flex-col items-center text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 shadow-sm">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            There are currently no documents in the repository. {isElevated ? "Upload a file to get started." : ""}
          </p>
          {isElevated && (
            <Button onClick={handleUploadClick} variant="outline" className="rounded-xl bg-white hover:bg-gray-50 border-gray-200">
              <UploadCloud className="w-4 h-4 mr-2" /> Select File
            </Button>
          )}
        </Card>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          No documents match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              key={doc.name}
            >
              <Card className="rounded-2xl p-4 flex flex-col h-full hover:shadow-md transition-shadow border-gray-100 group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#154D8C] flex items-center justify-center shrink-0">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h4 className="font-semibold text-sm text-gray-900 truncate" title={getDisplayName(doc.name)}>
                      {getDisplayName(doc.name)}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-1">
                      {formatFileSize(doc.metadata?.size || 0)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-medium">{formatDate(doc.created_at)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleView(doc.name)}
                      className="p-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-md transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc.name)}
                      className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-[#154D8C] rounded-md transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {isElevated && (
                      <>
                        <button 
                          onClick={() => openEditDialog(doc)}
                          className="p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-md transition-colors"
                          title="Rename"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.name)}
                          className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Name Prompt Modal */}
      <Dialog open={!!pendingFile} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Name your Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Display Name</label>
              <Input 
                value={uploadName} 
                onChange={(e) => setUploadName(e.target.value)} 
                placeholder="Enter a friendly name for this document"
                className="rounded-xl"
              />
              <p className="text-[10px] text-gray-400">Original file: {pendingFile?.name}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingFile(null)} className="rounded-xl" disabled={uploading}>Cancel</Button>
            <Button onClick={confirmUpload} className="rounded-xl bg-[#154D8C] hover:bg-[#154D8C]/90" disabled={uploading}>
              {uploading ? "Uploading..." : "Save Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Name</label>
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)} className="rounded-xl" disabled={editing}>Cancel</Button>
            <Button onClick={saveEdit} className="rounded-xl bg-[#154D8C] hover:bg-[#154D8C]/90" disabled={editing}>
              {editing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={!!viewingDoc} onOpenChange={(open) => {
        if (!open) {
          if (viewingDoc?.url) URL.revokeObjectURL(viewingDoc.url);
          setViewingDoc(null);
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-slate-50">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shrink-0 flex items-center justify-between">
            <DialogTitle className="text-lg font-bold truncate pr-4 flex items-center gap-2">
              <FileIcon className="w-5 h-5 text-blue-400" /> 
              {viewingDoc ? getDisplayName(viewingDoc.name) : ""}
            </DialogTitle>
          </div>
          
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 min-h-[500px]">
            {viewingDoc?.type?.startsWith('image/') ? (
              <img src={viewingDoc.url} alt="Document preview" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm border border-slate-200" />
            ) : viewingDoc?.type === 'application/pdf' || viewingDoc?.type === 'office' ? (
              <iframe src={viewingDoc.url} className="w-full h-full min-h-[75vh] rounded-lg shadow-sm border border-slate-200 bg-white" title="Document preview" />
            ) : (
              <div className="text-center bg-white p-12 rounded-2xl border border-dashed border-slate-300 shadow-sm">
                <FileIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Preview not available</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">This file type ({viewingDoc?.type || 'unknown'}) cannot be previewed directly in the browser.</p>
                <Button onClick={() => {
                  if (viewingDoc) handleDownload(viewingDoc.name);
                }} className="bg-[#154D8C] hover:bg-[#154D8C]/90">
                  <Download className="w-4 h-4 mr-2" /> Download File Instead
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}