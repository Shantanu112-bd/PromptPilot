"use client";

import { AlertTriangle, Check, Copy, Loader2, Play } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateProjectPlanAction, type ProjectPlanResult } from "@/features/planner/server/generate-plan";

type TabKey = keyof ProjectPlanResult;

const TAB_LABELS: Record<TabKey, string> = {
  prd: "PRD",
  folderStructure: "Folder Structure",
  databaseDesign: "Database Design",
  apiDesign: "API Design",
  roadmap: "Roadmap",
  deployment: "Deployment"
};

export const ProjectPlanner = React.memo(function ProjectPlanner() {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<ProjectPlanResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("prd");
  const [isCopied, setIsCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleGenerate() {
    if (idea.trim().length < 10) {
      setValidationError("Your idea must be at least 10 characters long.");
      return;
    }

    setValidationError(null);
    setIsGenerating(true);
    setError(null);
    setPlanResult(null);

    try {
      const result = await generateProjectPlanAction({ idea });
      if (result.ok) {
        setPlanResult(result.data);
        setActiveTab("prd");
        toast.success("Project plan generated successfully!");
      } else {
        setError(result.error);
        toast.error("Generation failed.");
      }
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.");
      toast.error("Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    if (!planResult) return;

    try {
      await navigator.clipboard.writeText(planResult[activeTab]);
      setIsCopied(true);
      toast.success(`${TAB_LABELS[activeTab]} copied!`);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy to clipboard.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Idea</CardTitle>
          <CardDescription>Enter the concept for your software project to generate a full technical architecture and plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A real-time collaborative markdown editor with AI auto-complete and team workspaces..."
              className={`min-h-32 resize-y transition-colors focus-visible:ring-primary ${
                validationError ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
            {validationError && (
              <p className="text-xs font-medium text-destructive">{validationError}</p>
            )}
          </div>
          <Button className="w-full sm:w-auto" disabled={isGenerating} onClick={handleGenerate}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Architecting Solution...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Project Plan
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Generation Error</p>
                <p className="mt-0.5 text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Section */}
      {isGenerating && !planResult && (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <h3 className="mt-4 font-semibold text-lg">Designing Architecture...</h3>
          <p className="mt-2 text-sm text-muted-foreground">This may take up to a minute depending on complexity.</p>
        </Card>
      )}

      {planResult && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-md border-b-2 ${
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>

          <Card className="flex flex-col h-full min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
              <div>
                <CardTitle className="text-lg">{TAB_LABELS[activeTab]}</CardTitle>
                <CardDescription className="mt-1 text-xs">
                  Generated architectural specification.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} title="Copy section to clipboard">
                  {isCopied ? (
                    <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="relative flex-1 rounded-lg border bg-muted/50 p-6">
                <pre className="max-h-[800px] overflow-auto whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                  {planResult[activeTab]}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
});
