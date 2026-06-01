import { describe, it, expect } from 'vitest';
import { generatePromptStrategy, type PromptStrategyInput } from '@/features/prompts/lib/prompt-strategy-engine';

describe('Prompt Strategy Engine', () => {
  const baseInput: PromptStrategyInput = {
    userIdea: 'A task management app',
    goal: 'Create a responsive sidebar navigation',
    tool: 'Cursor',
    model: 'GPT',
    framework: 'Next.js',
    language: 'TypeScript',
    experienceLevel: 'Intermediate',
    promptStyle: 'Structured',
  };

  it('should generate a valid strategy output for Cursor', () => {
    const output = generatePromptStrategy(baseInput);

    expect(output.tool).toBe('Cursor');
    expect(output.strategyName).toContain('Cursor');
    expect(output.sections).toEqual(['Goal', 'Requirements', 'Constraints', 'Acceptance Criteria']);
    
    // Check if prompt contains the user goal and idea
    expect(output.optimizedPrompt).toContain(baseInput.goal);
    expect(output.optimizedPrompt).toContain(baseInput.userIdea);
    
    // Check if prompt contains shared opening correctly formatted
    expect(output.optimizedPrompt).toContain('expert Next.js engineer working in TypeScript');
    expect(output.optimizedPrompt).toContain('intermediate developer using GPT');
    expect(output.optimizedPrompt).toContain('structured prompt style');
  });

  it('should generate a valid strategy output for Claude Code', () => {
    const input: PromptStrategyInput = { ...baseInput, tool: 'Claude Code' };
    const output = generatePromptStrategy(input);

    expect(output.tool).toBe('Claude Code');
    expect(output.sections).toContain('Deliverables');
    expect(output.optimizedPrompt).toContain('Claude Code');
  });

  it('should fallback to GenericToolStrategy for unknown tools', () => {
    // Cast to test fallback
    const input = { ...baseInput, tool: 'UnknownTool' as any };
    const output = generatePromptStrategy(input);

    expect(output.tool).toBe('UnknownTool');
    expect(output.strategyName).toBe('General AI tool strategy');
    expect(output.sections).toContain('Output Format');
  });
});
