"use client";

import { useState } from "react";
import { useFetchAnalytics } from "@/features/analytics/hooks/use-fetch-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function AdminAnalyticsClient() {
  const [range, setRange] = useState("30d");
  
  const { data: genData, isLoading: genLoading } = useFetchAnalytics<any>("/api/analytics/generations", range, true);
  const { data: toolsData, isLoading: toolsLoading } = useFetchAnalytics<any[]>("/api/analytics/tools", range, true);
  const { data: modelsData, isLoading: modelsLoading } = useFetchAnalytics<any[]>("/api/analytics/models", range, true);
  const { data: provData, isLoading: provLoading } = useFetchAnalytics<any[]>("/api/analytics/providers", range, true);

  const series = genData?.series || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tools Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tools Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {toolsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : toolsData?.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
              <div className="space-y-4">
                {toolsData?.map((tool: any) => (
                  <div key={tool.toolId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{tool.toolName}</p>
                      <p className="text-xs text-muted-foreground">{tool.totalTokens} tokens</p>
                    </div>
                    <div className="font-bold">{tool.generations}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Models Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Models Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {modelsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : modelsData?.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
              <div className="space-y-4">
                {modelsData?.map((model: any) => (
                  <div key={model.modelId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{model.modelName}</p>
                      <p className="text-xs text-muted-foreground">${model.costUsd}</p>
                    </div>
                    <div className="font-bold">{model.generations}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Providers Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Providers Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {provLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : provData?.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
              <div className="space-y-4">
                {provData?.map((prov: any) => (
                  <div key={prov.providerId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{prov.providerName}</p>
                      <p className="text-xs text-muted-foreground">${prov.costUsd}</p>
                    </div>
                    <div className="font-bold">{prov.generations}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generations History Simple view */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Generation Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {genLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : series?.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {series.map((day: any) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{day.date}</p>
                      <p className="text-xs text-muted-foreground">{day.totalTokens} tokens</p>
                    </div>
                    <div className="font-bold text-sm text-primary">{day.totalGenerations} gens</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
