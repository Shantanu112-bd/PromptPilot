"use client";

import { useState } from "react";
import { useFetchAnalytics } from "@/features/analytics/hooks/use-fetch-analytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminModelsClient() {
  const [range, setRange] = useState("30d");
  
  const { data: modelsData, isLoading: modelsLoading } = useFetchAnalytics<any[]>("/api/analytics/models", range, true);
  const { data: provData, isLoading: provLoading } = useFetchAnalytics<any[]>("/api/analytics/providers", range, true);

  return (
    <div className="space-y-8">
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AI Models Usage</h2>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead className="text-right">Generations</TableHead>
                <TableHead className="text-right">Tokens Used</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : modelsData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No models data found.
                  </TableCell>
                </TableRow>
              ) : (
                modelsData?.map((model) => (
                  <TableRow key={model.modelId}>
                    <TableCell className="font-medium">{model.modelName}</TableCell>
                    <TableCell className="text-right">{model.generations.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{model.totalTokens.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${Number(model.costUsd || 0).toFixed(4)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AI Providers Usage</h2>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider Name</TableHead>
                <TableHead className="text-right">Generations</TableHead>
                <TableHead className="text-right">Tokens Used</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : provData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No providers data found.
                  </TableCell>
                </TableRow>
              ) : (
                provData?.map((prov) => (
                  <TableRow key={prov.providerId}>
                    <TableCell className="font-medium">{prov.providerName}</TableCell>
                    <TableCell className="text-right">{prov.generations.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{prov.totalTokens.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${Number(prov.costUsd || 0).toFixed(4)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
