"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { fetchQAPairs, saveQAPairMock, deleteQAPairMock } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  question: z.string().min(1, "Question is required."),
  answer: z.string().min(1, "Answer is required."),
});

export default function QAManagementPage() {
  const [qaPairs, setQaPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPair, setEditingPair] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const loadQAPairs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQAPairs();
      setQaPairs(data);
    } catch (err) {
      toast.error("Failed to load Q&A pairs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQAPairs();
  }, []);

  const openAddModal = () => {
    setEditingPair(null);
    form.reset({ question: "", answer: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (pair) => {
    setEditingPair(pair);
    form.reset({ question: pair.question, answer: pair.answer });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQAPairMock(id);
      toast.success("Q&A pair deleted successfully.");
      setQaPairs(pairs => pairs.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Failed to delete Q&A pair.");
    }
  };

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      const payload = {
        ...values,
        id: editingPair?.id,
        date: editingPair?.date || new Date().toISOString().split('T')[0]
      };
      
      const savedPair = await saveQAPairMock(payload);
      
      if (editingPair) {
        setQaPairs(pairs => pairs.map(p => p.id === savedPair.id ? savedPair : p));
        toast.success("Q&A pair updated successfully.");
      } else {
        setQaPairs(pairs => [savedPair, ...pairs]);
        toast.success("Q&A pair added successfully.");
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save Q&A pair.");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => <div className="font-medium max-w-[300px] truncate" title={row.getValue("question")}>{row.getValue("question")}</div>,
    },
    {
      accessorKey: "answer",
      header: "Answer Preview",
      cell: ({ row }) => <div className="text-muted-foreground max-w-[400px] truncate" title={row.getValue("answer")}>{row.getValue("answer")}</div>,
    },
    {
      accessorKey: "date",
      header: "Created Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const pair = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => openEditModal(pair)} title="Edit">
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(pair.id)} title="Delete">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    }
  ];

  const filteredPairs = qaPairs.filter(pair => 
    pair.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Q&A Management</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Q&A..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" /> Add Q&A
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
          ) : filteredPairs.length > 0 ? (
            <DataTable columns={columns} data={filteredPairs} />
          ) : (
            <EmptyState 
              title="No Q&A pairs found" 
              description={searchQuery ? "No Q&A pairs match your search query." : "Add custom question-answer pairs to improve chatbot accuracy."}
              action={
                <Button onClick={openAddModal}>
                  <Plus className="mr-2 h-4 w-4" /> Add Q&A
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPair ? "Edit Q&A Pair" : "Add New Q&A Pair"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., How do I reset my password?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a clear, detailed answer..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
