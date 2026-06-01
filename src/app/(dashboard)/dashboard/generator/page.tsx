import { PageHeader } from "@/features/dashboard/components/page-header";
import { PromptGenerator } from "@/features/prompts/components/prompt-generator";

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Generator"
        description="Convert rough ideas into structured prompts for coding agents, AI models, and IDE assistants."
      />
      <PromptGenerator />
    </div>
  );
}
