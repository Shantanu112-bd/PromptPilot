import { PageHeader } from "@/features/dashboard/components/page-header";
import { PromptImprover } from "@/features/prompts/components/prompt-improver";

export default function ImproverPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Improver"
        description="Analyze your existing prompts and get AI-driven improvements for better results."
      />
      <PromptImprover />
    </div>
  );
}
