import { PageHeader } from "@/features/dashboard/components/page-header";
import { ProjectPlanner } from "@/features/planner/components/project-planner";

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Planner"
        description="Transform your software idea into a comprehensive technical architecture and execution plan."
      />
      <ProjectPlanner />
    </div>
  );
}
