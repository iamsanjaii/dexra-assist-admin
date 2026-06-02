"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileText, MessageSquareText, MessageCircle, Database, Activity, Cpu, Zap, Timer, CircleDollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { stats, aiAnalytics, recentUploads, activityFeed, isLoading } = useDashboard();

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
    { title: "Total Documents", value: stats?.totalDocuments || 0, icon: FileText },
    { title: "Total Q&A Pairs", value: stats?.totalQAPairs || 0, icon: MessageSquareText },
    { title: "Total Conversations", value: stats?.totalConversations || 0, icon: MessageCircle },
    { title: "Active Sources", value: stats?.activeKnowledgeSources || 0, icon: Database },
  ];

  const aiCards = [
    { title: "Total Tokens", value: aiAnalytics?.TotalTokens?.toLocaleString() || "0", icon: Cpu },
    { title: "Total Requests", value: aiAnalytics?.TotalRequests?.toLocaleString() || "0", icon: Zap },
    { title: "Avg Latency", value: `${aiAnalytics?.AvgLatency || 0} ms`, icon: Timer },
    { title: "Estimated Cost", value: `$${(aiAnalytics?.EstimatedCost || 0).toFixed(4)}`, icon: CircleDollarSign },
  ];

  const formatDailyStats = (statsArray) => {
    if (!statsArray || statsArray.length === 0) return [];
    return statsArray.map(stat => {
      const date = new Date(stat.name);
      // fallback if date parsing fails
      const dayName = isNaN(date.getTime()) ? stat.name : date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        ...stat,
        name: dayName
      };
    });
  };

  const chartData = formatDailyStats(aiAnalytics?.DailyStats);
  const tokenChartData = chartData.length > 0 ? chartData : [{ name: 'No Data', tokens: 0 }];
  const requestChartData = chartData.length > 0 ? chartData : [{ name: 'No Data', requests: 0 }];

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
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

      {/* AI Analytics Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">AI Analytics</h2>
        <p className="text-sm text-muted-foreground">LLM token usage and cost monitoring</p>
      </div>

      {/* AI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aiCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary/80">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Token Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tokenChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="tokens" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Requests Per Day</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads & Activity Feed */}
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
            <div className="space-y-8 max-h-[250px] overflow-y-auto pr-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.item}
                    </p>
                  </div>
                  <div className="ml-4 font-medium text-xs text-muted-foreground shrink-0 text-right">
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
