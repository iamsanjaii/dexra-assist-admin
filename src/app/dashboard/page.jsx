"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileText, MessageSquareText, MessageCircle, Database, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { stats, recentUploads, activityFeed, isLoading } = useDashboard();

  const columns = [
    {
      accessorKey: "filename",
      header: "File Name",
    },
    {
      accessorKey: "file_type",
      header: "Type",
    },
    {
      accessorKey: "created_at",
      header: "Upload Date",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
      accessorKey: "processing_status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("processing_status")} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Documents", value: stats?.totalDocuments, icon: FileText },
    { title: "Total Q&A Pairs", value: stats?.totalQAPairs, icon: MessageSquareText },
    { title: "Total Conversations", value: stats?.totalConversations, icon: MessageCircle },
    { title: "Active Sources", value: stats?.activeKnowledgeSources, icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 border-border/50">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={recentUploads} showPagination={false} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.item}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
