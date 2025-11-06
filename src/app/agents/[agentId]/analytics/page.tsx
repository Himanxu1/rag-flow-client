"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  Users,
  Loader2,
} from "lucide-react";
import { useAnalyticsStore } from "@/store";

export default function AnalyticsPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const {
    summary,
    isLoading,
    error,
    dateRange,
    setDateRange,
    fetchSummary,
  } = useAnalyticsStore();

  useEffect(() => {
    if (agentId) {
      fetchSummary(agentId);
    }
  }, [agentId, dateRange, fetchSummary]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Messages",
      value: summary?.totalMessages || 0,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Conversations",
      value: summary?.totalConversations || 0,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Response Time",
      value: `${summary?.avgResponseTime || 0}ms`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Tokens Used",
      value: (summary?.totalTokensUsed || 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Widget Opens",
      value: summary?.widgetOpens || 0,
      icon: MessageSquare,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Errors",
      value: summary?.errorCount || 0,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  // Prepare daily chart data
  const dailyData = summary?.dailyMessages
    ? Object.entries(summary.dailyMessages)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
    : [];

  // Prepare hourly chart data
  const hourlyData = summary?.hourlyDistribution
    ? Object.entries(summary.hourlyDistribution).map(([hour, count]) => ({
        hour: parseInt(hour),
        count,
      }))
    : [];

  const maxHourlyCount = Math.max(...hourlyData.map((d) => d.count), 1);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your chatbot's performance and usage
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2">
          <Button
            variant={dateRange === "7d" ? "default" : "outline"}
            onClick={() => setDateRange("7d")}
            size="sm"
          >
            Last 7 days
          </Button>
          <Button
            variant={dateRange === "30d" ? "default" : "outline"}
            onClick={() => setDateRange("30d")}
            size="sm"
          >
            Last 30 days
          </Button>
          <Button
            variant={dateRange === "all" ? "default" : "outline"}
            onClick={() => setDateRange("all")}
            size="sm"
          >
            All time
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Messages Chart */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Daily Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.length > 0 ? (
              <div className="space-y-3">
                {dailyData.map(([date, count]) => {
                  const maxDaily = Math.max(...dailyData.map(([, c]) => c), 1);
                  const percentage = (count / maxDaily) * 100;

                  return (
                    <div key={date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="font-semibold">{count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Hourly Distribution Chart */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {hourlyData.length > 0 ? (
              <div className="flex items-end justify-between gap-1 h-48">
                {hourlyData.map(({ hour, count }) => {
                  const height = (count / maxHourlyCount) * 100;

                  return (
                    <div
                      key={hour}
                      className="flex-1 flex flex-col items-center gap-1 group"
                    >
                      <div className="relative flex-1 w-full flex items-end">
                        <div
                          className="w-full bg-primary rounded-t transition-all group-hover:bg-primary/80"
                          style={{ height: `${height}%` }}
                          title={`${hour}:00 - ${count} messages`}
                        />
                      </div>
                      {hour % 3 === 0 && (
                        <span className="text-xs text-muted-foreground">
                          {hour}h
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
