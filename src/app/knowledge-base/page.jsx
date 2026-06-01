"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { fetchDocuments, uploadDocumentMock, deleteDocumentMock } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { UploadCloud, Eye, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

// Animated progress bar shown while a document is being processed
function ProcessingProgress({ processed, total }) {
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-yellow-500 dark:text-yellow-400">Processing…</span>
        <span>
          {processed}/{total} chunks
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pollRef = useRef(null);

  const loadDocuments = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      return data;
    } catch (err) {
      if (!silent) toast.error("Failed to load documents.");
      return [];
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Start / stop polling based on whether any doc is still processing
  const managePoll = useCallback((docs) => {
    const hasProcessing = docs.some((d) => d.processing_status === "processing");

    if (hasProcessing && !pollRef.current) {
      pollRef.current = setInterval(async () => {
        const updated = await loadDocuments(true);
        const stillProcessing = updated.some((d) => d.processing_status === "processing");
        if (!stillProcessing) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          toast.success("Document processing complete!");
        }
      }, 3000);
    } else if (!hasProcessing && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [loadDocuments]);

  useEffect(() => {
    loadDocuments().then(managePoll);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadDocuments, managePoll]);

  // Re-evaluate polling whenever docs change
  useEffect(() => {
    managePoll(documents);
  }, [documents, managePoll]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0) {
      if (rejectedFiles.length > 0) {
        toast.error(`File rejected: ${rejectedFiles[0].errors[0].message}`);
      }
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading document…");

    try {
      await uploadDocumentMock(acceptedFiles[0]);
      toast.success("Document uploaded! Processing started.", { id: toastId });
      const data = await loadDocuments(true);
      setDocuments(data);
    } catch (err) {
      toast.error("Failed to upload document.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, [loadDocuments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
    disabled: isUploading,
  });

  const handleDelete = async (id) => {
    try {
      await deleteDocumentMock(id);
      toast.success("Document deleted successfully.");
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  const columns = [
    {
      accessorKey: "filename",
      header: "File Name",
    },
    {
      accessorKey: "file_type",
      header: "File Type",
    },
    {
      accessorKey: "created_at",
      header: "Upload Date",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
      accessorKey: "processing_status",
      header: "Status",
      cell: ({ row }) => {
        const doc = row.original;
        if (doc.processing_status === "processing") {
          return (
            <ProcessingProgress
              processed={doc.processed_chunks ?? 0}
              total={doc.chunk_count ?? 0}
            />
          );
        }
        return <StatusBadge status={doc.processing_status} />;
      },
    },
    {
      accessorKey: "chunk_count",
      header: "Chunks",
      cell: ({ row }) => {
        const doc = row.original;
        if (doc.processing_status === "ready") return doc.chunk_count;
        return "—";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doc = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              onClick={() => handleDelete(doc.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Upload Knowledge Source</CardTitle>
          <CardDescription>Supported formats: PDF, DOCX, XLSX, CSV, TXT</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}
              ${isUploading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              or click to browse from your computer
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Documents</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredDocuments.length > 0 ? (
            <DataTable columns={columns} data={filteredDocuments} />
          ) : (
            <EmptyState
              title="No documents found"
              description={
                searchQuery
                  ? "No documents match your search query."
                  : "Upload your first knowledge source to begin training the chatbot."
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
