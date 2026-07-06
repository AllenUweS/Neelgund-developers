import { r as reactExports, W as jsxRuntimeExports } from "./index.mjs";
import { P as PageHeader } from "./PageHeader-D_JcINPd.mjs";
import { C as Card } from "./card-D4It2k98.mjs";
import { B as Button } from "./button-BS0Rn7Xn.mjs";
import { D as Dialog, a as DialogContent, e as DialogHeader, b as DialogTitle, f as DialogFooter } from "./dialog-iwZRVXZk.mjs";
import { I as Input } from "./input-DOZ_xDPt.mjs";
import { u as useAuth, s as supabase, t as toast } from "./router-kA0jnLqi.mjs";
import { c as createLucideIcon } from "./createLucideIcon-Bp8knoDP.mjs";
import { S as Search } from "./search-DqizMWow.mjs";
import { F as FileText } from "./file-text-B3PMezU-.mjs";
import { C as CircleAlert } from "./circle-alert-CAKHZepT.mjs";
import { m as motion } from "./proxy-CqksTbZr.mjs";
import { E as Eye } from "./eye-TEIcPtn-.mjs";
import { D as Download } from "./download-D3C2DxtS.mjs";
import { T as Trash2 } from "./trash-2-CA_VOnxh.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./utils-BH6shBk-.mjs";
import "./index-BNcWPUAp.mjs";
import "./Combination-Bz5I4c0I.mjs";
import "./x-DD9OPI7P.mjs";
const __iconNode$2 = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("cloud-upload", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }]
];
const File = createLucideIcon("file", __iconNode$1);
const __iconNode = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
function DocumentsPage() {
  const {
    role
  } = useAuth();
  const isElevated = role === "admin" || role === "super_admin" || role === "manager" || role === "hr";
  const [documents, setDocuments] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [viewingDoc, setViewingDoc] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [uploadName, setUploadName] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [editingDoc, setEditingDoc] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(false);
  const loadDocuments = async () => {
    setBusy(true);
    const {
      data,
      error
    } = await supabase.storage.from("documents").list();
    setBusy(false);
    if (error) {
      toast.error("Failed to load documents: " + error.message);
    } else {
      setDocuments(data?.filter(
        (file) => !file.name.startsWith(".") && file.name.includes(".") && // Only include actual files with extensions
        file.id !== null
        // Folders in Supabase typically have a null ID
      ) || []);
    }
  };
  reactExports.useEffect(() => {
    loadDocuments();
  }, []);
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large (max 10MB)");
      return;
    }
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
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
    const ext = pendingFile.name.substring(pendingFile.name.lastIndexOf("."));
    const finalName = uploadName.trim() + ext;
    const {
      error: storageError
    } = await supabase.storage.from("documents").upload(finalName, pendingFile);
    setUploading(false);
    if (storageError) {
      toast.error("Upload failed: " + storageError.message);
    } else {
      toast.success("Document uploaded successfully");
      setPendingFile(null);
      loadDocuments();
    }
  };
  const openEditDialog = (doc) => {
    setEditingDoc(doc);
    const nameWithoutExt = doc.name.substring(0, doc.name.lastIndexOf(".")) || doc.name;
    setEditName(nameWithoutExt);
  };
  const saveEdit = async () => {
    if (!editingDoc || !editName.trim()) return;
    setEditing(true);
    const ext = editingDoc.name.substring(editingDoc.name.lastIndexOf("."));
    const newFullName = editName.trim() + ext;
    if (newFullName === editingDoc.name) {
      setEditing(false);
      setEditingDoc(null);
      return;
    }
    const {
      error
    } = await supabase.storage.from("documents").move(editingDoc.name, newFullName);
    setEditing(false);
    if (error) {
      toast.error("Failed to rename document: " + error.message);
    } else {
      toast.success("Document renamed successfully");
      setEditingDoc(null);
      loadDocuments();
    }
  };
  const handleDownload = async (fileName) => {
    const {
      data,
      error
    } = await supabase.storage.from("documents").download(fileName);
    if (error) {
      toast.error("Download failed: " + error.message);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const handleView = async (fileName) => {
    setBusy(true);
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const isOfficeDoc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);
    if (isOfficeDoc) {
      const {
        data: signedData,
        error: signedError
      } = await supabase.storage.from("documents").createSignedUrl(fileName, 60 * 60);
      setBusy(false);
      if (signedError || !signedData) {
        toast.error("Failed to generate preview link");
        return;
      }
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(signedData.signedUrl)}&embedded=true`;
      setViewingDoc({
        name: fileName,
        url: viewerUrl,
        type: "office"
      });
    } else {
      const {
        data,
        error
      } = await supabase.storage.from("documents").download(fileName);
      setBusy(false);
      if (error) {
        toast.error("Failed to load document preview: " + error.message);
        return;
      }
      const url = URL.createObjectURL(data);
      setViewingDoc({
        name: fileName,
        url,
        type: data.type
      });
    }
  };
  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    setBusy(true);
    const {
      data,
      error
    } = await supabase.storage.from("documents").remove([fileName]);
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
  const filteredDocs = documents.filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()));
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getDisplayName = (fileName) => {
    return fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Document center", subtitle: "Manage ID proofs, certificates, and contracts." }),
      isElevated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", ref: fileInputRef, className: "hidden", onChange: handleFileChange, accept: ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleUploadClick, className: "bg-[#154D8C] text-white hover:bg-[#154D8C]/90 rounded-xl shadow-md h-10 px-6 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4" }),
          "Upload Document"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-5 h-5 text-gray-400 ml-2 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search documents by name...", value: search, onChange: (e) => setSearch(e.target.value), className: "flex-1 bg-transparent border-none outline-none text-sm p-1" })
    ] }),
    busy && documents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-8 w-8 border-b-2 border-[#154D8C] rounded-full" }) }) : documents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-12 flex flex-col items-center text-center border-dashed border-2 border-gray-200 bg-gray-50/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "No documents found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 max-w-sm mb-6", children: [
        "There are currently no documents in the repository. ",
        isElevated ? "Upload a file to get started." : ""
      ] }),
      isElevated && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleUploadClick, variant: "outline", className: "rounded-xl bg-white hover:bg-gray-50 border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "w-4 h-4 mr-2" }),
        " Select File"
      ] })
    ] }) : filteredDocs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 mx-auto mb-3 text-gray-300" }),
      "No documents match your search."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filteredDocs.map((doc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.05
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 flex flex-col h-full hover:shadow-md transition-shadow border-gray-100 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-blue-50 text-[#154D8C] flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-gray-900 truncate", title: getDisplayName(doc.name), children: getDisplayName(doc.name) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-1", children: formatFileSize(doc.metadata?.size || 0) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-4 border-t border-gray-50 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-medium", children: formatDate(doc.created_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleView(doc.name), className: "p-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded-md transition-colors", title: "Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDownload(doc.name), className: "p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-[#154D8C] rounded-md transition-colors", title: "Download", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }) }),
          isElevated && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEditDialog(doc), className: "p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-md transition-colors", title: "Rename", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(doc.name), className: "p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-colors", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
          ] })
        ] })
      ] })
    ] }) }, doc.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!pendingFile, onOpenChange: (open) => !open && setPendingFile(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Name your Document" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "Display Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: uploadName, onChange: (e) => setUploadName(e.target.value), placeholder: "Enter a friendly name for this document", className: "rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400", children: [
          "Original file: ",
          pendingFile?.name
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPendingFile(null), className: "rounded-xl", disabled: uploading, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmUpload, className: "rounded-xl bg-[#154D8C] hover:bg-[#154D8C]/90", disabled: uploading, children: uploading ? "Uploading..." : "Save Document" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editingDoc, onOpenChange: (open) => !open && setEditingDoc(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Rename Document" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "New Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editName, onChange: (e) => setEditName(e.target.value), className: "rounded-xl" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingDoc(null), className: "rounded-xl", disabled: editing, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveEdit, className: "rounded-xl bg-[#154D8C] hover:bg-[#154D8C]/90", disabled: editing, children: editing ? "Saving..." : "Save Changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewingDoc, onOpenChange: (open) => {
      if (!open) {
        if (viewingDoc?.url) URL.revokeObjectURL(viewingDoc.url);
        setViewingDoc(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-slate-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shrink-0 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-lg font-bold truncate pr-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-5 h-5 text-blue-400" }),
        viewingDoc ? getDisplayName(viewingDoc.name) : ""
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto flex items-center justify-center p-4 min-h-[500px]", children: viewingDoc?.type?.startsWith("image/") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: viewingDoc.url, alt: "Document preview", className: "max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm border border-slate-200" }) : viewingDoc?.type === "application/pdf" || viewingDoc?.type === "office" ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: viewingDoc.url, className: "w-full h-full min-h-[75vh] rounded-lg shadow-sm border border-slate-200 bg-white", title: "Document preview" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center bg-white p-12 rounded-2xl border border-dashed border-slate-300 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-16 h-16 text-slate-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-slate-700 mb-2", children: "Preview not available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 mb-6 max-w-sm", children: [
          "This file type (",
          viewingDoc?.type || "unknown",
          ") cannot be previewed directly in the browser."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          if (viewingDoc) handleDownload(viewingDoc.name);
        }, className: "bg-[#154D8C] hover:bg-[#154D8C]/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
          " Download File Instead"
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  DocumentsPage as component
};
