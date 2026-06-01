export const supportedTools = [
  "Cursor",
  "Claude Code",
  "Copilot",
  "Bolt",
  "Warp",
  "Windsurf",
  "Lovable",
  "ChatGPT",
  "Gemini",
  "DeepSeek"
] as const;

export const supportedModels = ["GPT", "Claude Sonnet", "Claude Opus", "Gemini", "DeepSeek", "Llama", "Qwen", "Mistral"] as const;

export const supportedFrameworks = [
  "Next.js",
  "React",
  "Vue",
  "SvelteKit",
  "Node.js",
  "Express",
  "NestJS",
  "FastAPI",
  "Laravel",
  "Rails"
] as const;

export const supportedLanguages = ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "PHP", "Ruby"] as const;

export const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const promptStyles = ["Structured", "Concise", "Detailed", "Step-by-step", "Production-ready"] as const;

export type SupportedTool = (typeof supportedTools)[number];
export type SupportedModel = (typeof supportedModels)[number];
export type SupportedFramework = (typeof supportedFrameworks)[number];
export type SupportedLanguage = (typeof supportedLanguages)[number];
export type ExperienceLevel = (typeof experienceLevels)[number];
export type PromptStyle = (typeof promptStyles)[number];

export type PromptStrategyInput = {
  userIdea: string;
  goal: string;
  tool: SupportedTool;
  model: SupportedModel;
  framework: SupportedFramework;
  language: SupportedLanguage;
  experienceLevel: ExperienceLevel;
  promptStyle: PromptStyle;
};

export type PromptStrategyOutput = {
  tool: SupportedTool;
  strategyName: string;
  optimizedPrompt: string;
  sections: string[];
};

export interface PromptStrategy {
  readonly tool: SupportedTool;
  readonly strategyName: string;
  generate(input: PromptStrategyInput): PromptStrategyOutput;
}

const sharedOpening = (input: PromptStrategyInput) =>
  `You are an expert ${input.framework} engineer working in ${input.language}. Optimize the response for a ${input.experienceLevel.toLowerCase()} developer using ${input.model}. Use a ${input.promptStyle.toLowerCase()} prompt style.`;

const sharedQualityBar = [
  "Prioritize production-grade architecture, type safety, accessibility, responsive design, loading states, empty states, and error handling.",
  "Call out assumptions before implementation.",
  "Avoid vague advice. Return concrete files, components, data models, and verification steps when relevant."
].join("\n");

class CursorStrategy implements PromptStrategy {
  readonly tool = "Cursor";
  readonly strategyName = "Cursor implementation strategy";

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Goal", "Requirements", "Constraints", "Acceptance Criteria"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

GOAL
${input.goal}

PROJECT CONTEXT
- Build this goal within the following project idea context: ${input.userIdea}

REQUIREMENTS
- Use ${input.framework} with ${input.language}.
- Break the work into small, reviewable implementation steps.
- Reuse existing project conventions before introducing new abstractions.
- Include all required UI states: loading, empty, error, disabled, and success.

CONSTRAINTS
- Keep changes scoped to the feature.
- Maintain strict type safety.
- Do not introduce unnecessary dependencies.
- Preserve mobile-first responsive behavior and dark mode.

ACCEPTANCE CRITERIA
- The feature works end to end.
- Components are reusable where appropriate.
- Code is accessible and production-ready.
- Relevant checks or manual verification steps are listed.

${sharedQualityBar}`
    };
  }
}

class ClaudeCodeStrategy implements PromptStrategy {
  readonly tool = "Claude Code";
  readonly strategyName = "Claude Code execution strategy";

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Context", "Task", "Deliverables", "Constraints"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

CONTEXT
The project is built on ${input.framework} using ${input.language}. The target model is ${input.model}. The user experience level is ${input.experienceLevel}.
Project Context Idea: ${input.userIdea}

TASK
Implement the following target goal using Claude Code:
${input.goal}

DELIVERABLES
- Briefly inspect the codebase before editing.
- Produce production-ready code with reusable components.
- Add or update route/page structure when needed.
- Include responsive UI, dark mode support, and accessible interactions.
- Summarize changed files and verification performed.

CONSTRAINTS
- Keep server-only logic out of client components.
- Prefer existing architecture and feature folders.
- Handle errors explicitly.
- Do not leave incomplete TODO placeholders.

${sharedQualityBar}`
    };
  }
}

class CopilotStrategy implements PromptStrategy {
  readonly tool = "Copilot";
  readonly strategyName = "Focused Copilot coding strategy";

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Focused Coding Instructions"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

FOCUSED CODING INSTRUCTIONS
Implement the following goal:
${input.goal}

PROJECT CONTEXT
- Target project outline: ${input.userIdea}
- Use ${input.framework} and ${input.language}. Keep suggestions narrow and directly actionable.

Copilot should:
- Generate typed components and helper functions.
- Use clear prop types and avoid any.
- Include loading, empty, and error states.
- Prefer small reusable components.
- Keep styling consistent with the existing Tailwind and UI system.
- Suggest tests or verification steps after implementation.

${sharedQualityBar}`
    };
  }
}

class BoltStrategy implements PromptStrategy {
  readonly tool = "Bolt";
  readonly strategyName = "Bolt product build strategy";

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Product Requirements", "UI Requirements"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

PRODUCT REQUIREMENTS
Create a working product matching this goal:
${input.goal}

- Broad project concept context: ${input.userIdea}
- Define the core user journey.
- Build the first usable screen immediately.
- Include realistic empty, loading, and error states.
- Use ${input.framework} and ${input.language}.
- Keep the app responsive across mobile and desktop.

UI REQUIREMENTS
- Use polished SaaS layout patterns.
- Include clear navigation and primary actions.
- Make forms accessible with labels, validation messaging, and disabled states.
- Ensure dark mode support.
- Keep visual hierarchy clean and conversion-focused.

${sharedQualityBar}`
    };
  }
}

class WarpStrategy implements PromptStrategy {
  readonly tool = "Warp";
  readonly strategyName = "Warp rule-based strategy";

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Rules", "Execution", "Verification"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

RULES
1. First inspect the project structure.
2. Use ${input.framework} and ${input.language} conventions.
3. Keep implementation scoped to this target goal:
   ${input.goal}
4. Broad project context: ${input.userIdea}
5. Prefer commands that are safe and reversible.
6. Explain failures with the exact command and result.

EXECUTION
- Identify files to change.
- Implement reusable components or utilities only when they reduce duplication.
- Add responsive, accessible UI states.
- Handle errors and edge cases explicitly.

VERIFICATION
- Run available lint, typecheck, tests, or build commands.
- If a command cannot run, explain why and provide the next command to run locally.

${sharedQualityBar}`
    };
  }
}

class GenericToolStrategy implements PromptStrategy {
  constructor(
    readonly tool: SupportedTool,
    readonly strategyName = "General AI tool strategy"
  ) {}

  generate(input: PromptStrategyInput): PromptStrategyOutput {
    const sections = ["Context", "Objective", "Output Format", "Quality Bar"];

    return {
      tool: this.tool,
      strategyName: this.strategyName,
      sections,
      optimizedPrompt: `${sharedOpening(input)}

CONTEXT
Target tool: ${input.tool}
Target framework: ${input.framework}
Target language: ${input.language}
Experience level: ${input.experienceLevel}
Prompt style: ${input.promptStyle}
Broad project concept context: ${input.userIdea}

OBJECTIVE
Achieve this target goal:
${input.goal}

OUTPUT FORMAT
- Assumptions
- Recommended architecture
- Step-by-step plan
- Files and components to create or update
- Edge cases
- Verification checklist

QUALITY BAR
${sharedQualityBar}`
    };
  }
}

const strategyRegistry: Record<SupportedTool, PromptStrategy> = {
  Cursor: new CursorStrategy(),
  "Claude Code": new ClaudeCodeStrategy(),
  Copilot: new CopilotStrategy(),
  Bolt: new BoltStrategy(),
  Warp: new WarpStrategy(),
  Windsurf: new GenericToolStrategy("Windsurf", "Windsurf agent strategy"),
  Lovable: new GenericToolStrategy("Lovable", "Lovable product strategy"),
  ChatGPT: new GenericToolStrategy("ChatGPT", "ChatGPT structured strategy"),
  Gemini: new GenericToolStrategy("Gemini", "Gemini multimodal strategy"),
  DeepSeek: new GenericToolStrategy("DeepSeek", "DeepSeek reasoning strategy")
};

export function generatePromptStrategy(input: PromptStrategyInput): PromptStrategyOutput {
  const strategy = strategyRegistry[input.tool] ?? new GenericToolStrategy(input.tool);

  return strategy.generate({
    ...input,
    userIdea: input.userIdea.trim(),
    goal: input.goal.trim()
  });
}

export function registerPromptStrategy(tool: SupportedTool, strategy: PromptStrategy) {
  strategyRegistry[tool] = strategy;
}
