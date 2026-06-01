"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Database, Server, Cpu } from "lucide-react";

export function AdminSystemClient() {
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      setHealth({ status: "error", error: "Failed to fetch health endpoint" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={checkHealth} disabled={isLoading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">System Status</CardTitle>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={health?.status === "healthy" ? "default" : "destructive"}>
                {health?.status || "Unknown"}
              </Badge>
              <span className="text-xs text-muted-foreground">Main API</span>
            </div>
            {health?.error && <p className="text-xs text-destructive mt-2">{health.error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Database Status</CardTitle>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={health?.database === "connected" ? "default" : "destructive"}>
                {health?.database || "Unknown"}
              </Badge>
              <span className="text-xs text-muted-foreground">PostgreSQL (Prisma)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">AI Providers</CardTitle>
            <Cpu className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default">Healthy</Badge>
              <span className="text-xs text-muted-foreground">OpenAI, Anthropic, etc.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
