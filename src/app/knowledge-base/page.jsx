"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      toast.error("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    const toastId = toast.loading("Uploading document...");
    
    try {
      // Simulate uploading first file
      await uploadDocumentMock(acceptedFiles[0]);
      toast.success("Document uploaded successfully.", { id: toastId });
      // Reload documents
      await loadDocuments();
    } catch (err) {
      toast.error("Failed to upload document.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    disabled: isUploading
  });

  const handleDelete = async (id) => {
    try {
      await deleteDocumentMock(id);
      toast.success("Document deleted successfully.");
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "File Name",
    },
    {
      accessorKey: "type",
      header: "File Type",
    },
    {
      accessorKey: "date",
      header: "Upload Date",
    },
    {
      accessorKey: "status",
      header: "Processing Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
    }
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Upload Knowledge Source</CardTitle>
          <CardDescription>
            Supported formats: PDF, DOCX, XLSX, CSV, TXT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            {...getRootProps()} 
            className={`
              flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg transition-colors cursor-pointer
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
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
              description={searchQuery ? "No documents match your search query." : "Upload your first knowledge source to begin training the chatbot."}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
