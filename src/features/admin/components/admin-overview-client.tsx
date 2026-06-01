"use client";

import { useState } from "react";
import { useFetchAnalytics } from "@/features/analytics/hooks/use-fetch-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, FileText, Zap, Clock, Activity, Coins, Loader2 } from "lucide-react";

type BaseStats = {
  totalUsers: number;
  activeUsers: number;
  totalPrompts: number;
  totalTemplates: number;
};

export function AdminOverviewClient({ baseStats }: { baseStats: BaseStats }) {
  const [range, setRange] = useState("30d");
  const { data, isLoading, error } = useFetchAnalytics<any>("/api/analytics/overview", range, true);

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Base Stats from Server */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{baseStats.activeUsers} active in last 30d</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseStats.totalPrompts}</div>
            <p className="text-xs text-muted-foreground">{baseStats.totalTemplates} Templates</p>
          </CardContent>
        </Card>

        {/* Dynamic Analytics Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : error ? <span className="text-destructive text-sm">Error</span> : (
              <>
                <div className="text-2xl font-bold">{metrics?.totalGenerations || 0}</div>
                <p className="text-xs text-muted-foreground">{metrics?.successRate || 0}% Success Rate</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Cost</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : error ? <span className="text-destructive text-sm">Error</span> : (
              <>
                <div className="text-2xl font-bold">${metrics?.estimatedCostUsd || 0}</div>
                <p className="text-xs text-muted-foreground">{metrics?.totalTokens?.toLocaleString() || 0} tokens</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : error ? <span className="text-destructive text-sm">Error</span> : (
              <>
                <div className="text-2xl font-bold">{metrics?.avgLatencyMs || 0}ms</div>
                <p className="text-xs text-muted-foreground">Per Generation</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
