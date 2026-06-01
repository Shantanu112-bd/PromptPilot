"use client";

import { AlertTriangle, Bookmark, Check, Copy, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { analyzePromptAction, type PromptAnalysisResult } from "@/features/prompts/server/analyze-prompt";
import { savePromptAction } from "@/features/prompts/server/save-prompt";

export function PromptImprover() {
  const [existingPrompt, setExistingPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [analysisResult, setAnalysisResult] = useState<PromptAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const [saveTitle, setSaveTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ prompt?: string; save?: string }>({});

  async function handleAnalyze() {
    if (existingPrompt.trim().length < 5) {
      setValidationErrors({ prompt: "Prompt must be at least 5 characters to analyze." });
      return;
    }

    setValidationErrors({});
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzePromptAction({ prompt: existingPrompt });
      if (result.ok) {
        setAnalysisResult(result.data);
        toast.success("Prompt analysis complete!");
      } else {
        setError(result.error);
        toast.error("Analysis failed.");
      }
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.");
      toast.error("Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleCopy() {
    if (!analysisResult?.improvedPrompt) return;

    try {
      await navigator.clipboard.writeText(analysisResult.improvedPrompt);
      setIsCopied(true);
      toast.success("Improved prompt copied!");
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy to clipboard.");
    }
  }

  async function handleSave() {
    if (!analysisResult?.improvedPrompt) return;

    if (!saveTitle.trim()) {
      setValidationErrors((prev) => ({ ...prev, save: "Title is required to save to your library." }));
      return;
    }

    setIsSaving(true);
    setValidationErrors((prev) => ({ ...prev, save: undefined }));

    try {
      const result = await savePromptAction({
        title: saveTitle.trim(),
        content: analysisResult.improvedPrompt,
        description: `Improved via Prompt Improver (Score: ${analysisResult.qualityScore}/100)`
      });

      if (result.ok) {
        toast.success("Improved prompt saved to library!");
        setShowSaveDialog(false);
        setSaveTitle("");
      } else {
        setValidationErrors((prev) => ({ ...prev, save: result.error }));
        toast.error("Failed to save prompt.");
      }
    } catch (err: any) {
      setValidationErrors((prev) => ({ ...prev, save: err.message ?? "Network failure." }));
      toast.error("Failed to save prompt.");
    } finally {
      setIsSaving(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-destructive";
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Prompt</CardTitle>
          <CardDescription>Paste your current prompt here for AI-driven analysis and enhancement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={existingPrompt}
              onChange={(e) => setExistingPrompt(e.target.value)}
              placeholder="e.g. Write a python script to scrape a website..."
              className={`min-h-32 resize-y transition-colors focus-visible:ring-primary ${
                validationErrors.prompt ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
            {validationErrors.prompt && (
              <p className="text-xs font-medium text-destructive">{validationErrors.prompt}</p>
            )}
          </div>
          <Button className="w-full sm:w-auto" disabled={isAnalyzing} onClick={handleAnalyze}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing Prompt...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Analyze & Improve
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Analysis Error</p>
                <p className="mt-0.5 text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Section */}
      {isAnalyzing && !analysisResult && (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <h3 className="mt-4 font-semibold">Evaluating constraints and structure...</h3>
          <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds.</p>
        </Card>
      )}

      {analysisResult && (
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Analysis Dashboard */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Quality Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(analysisResult.qualityScore)}`}>
                    {analysisResult.qualityScore}
                  </span>
                  <span className="text-muted-foreground font-medium">/ 100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm border-b pb-1 mb-2">Clarity</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    {analysisResult.analysis.clarity.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm border-b pb-1 mb-2">Context</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    {analysisResult.analysis.context.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm border-b pb-1 mb-2">Constraints</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    {analysisResult.analysis.constraints.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm border-b pb-1 mb-2">Structure</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                    {analysisResult.analysis.structure.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improved Prompt Display */}
          <Card className="flex flex-col h-full min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
              <div>
                <CardTitle className="text-lg">Improved Prompt</CardTitle>
                <CardDescription className="line-clamp-1 mt-1 text-xs">
                  Production-ready and highly structured.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} title="Copy to clipboard">
                  {isCopied ? (
                    <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">Copy</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)} title="Save to library">
                  <Bookmark className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  <span className="sr-only">Save</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="relative flex-1 rounded-lg border bg-muted/50 p-4">
                <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap text-sm leading-6 font-mono text-foreground">
                  {analysisResult.improvedPrompt}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Modal Dialog Backdrop Overlay */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true">
          <Card className="w-full max-w-md shadow-2xl border bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Save to Prompt Library</CardTitle>
              <CardDescription>Name your improved prompt to store it in your collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saveTitle" className="text-sm font-semibold">
                  Prompt Name
                </Label>
                <Input
                  id="saveTitle"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="e.g. Scrape python script refined"
                  className={validationErrors.save ? "border-destructive focus-visible:ring-destructive" : ""}
                  autoFocus
                />
                {validationErrors.save && (
                  <p className="text-xs font-semibold text-destructive">{validationErrors.save}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveTitle("");
                    setValidationErrors({});
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    "Save to Library"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
