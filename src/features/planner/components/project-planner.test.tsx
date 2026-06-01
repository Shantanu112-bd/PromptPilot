import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectPlanner } from './project-planner';
import { generateProjectPlanAction } from '@/features/planner/server/generate-plan';

// Mock the server action
vi.mock('@/features/planner/server/generate-plan', () => ({
  generateProjectPlanAction: vi.fn(),
}));

// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ProjectPlanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the input area and generate button', () => {
    render(<ProjectPlanner />);
    
    expect(screen.getByText('Describe Your Idea')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/A real-time collaborative markdown editor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate project plan/i })).toBeInTheDocument();
  });

  it('should show validation error if idea is too short', async () => {
    render(<ProjectPlanner />);
    
    const input = screen.getByPlaceholderText(/A real-time collaborative markdown editor/i);
    fireEvent.change(input, { target: { value: 'Short' } });
    
    const button = screen.getByRole('button', { name: /generate project plan/i });
    fireEvent.click(button);
    
    expect(await screen.findByText(/Your idea must be at least 10 characters long/i)).toBeInTheDocument();
    expect(generateProjectPlanAction).not.toHaveBeenCalled();
  });

  it('should call generate action and display results on success', async () => {
    const mockPlanResult = {
      prd: 'PRD Content',
      folderStructure: 'Folder Content',
      databaseDesign: 'DB Content',
      apiDesign: 'API Content',
      roadmap: 'Roadmap Content',
      deployment: 'Deployment Content',
    };
    
    (generateProjectPlanAction as any).mockResolvedValue({
      ok: true,
      data: mockPlanResult,
    });

    render(<ProjectPlanner />);
    
    const input = screen.getByPlaceholderText(/A real-time collaborative markdown editor/i);
    fireEvent.change(input, { target: { value: 'This is a sufficiently long valid idea for a project' } });
    
    const button = screen.getByRole('button', { name: /generate project plan/i });
    fireEvent.click(button);
    
    // Check loading state
    expect(await screen.findByText(/Architecting Solution/i)).toBeInTheDocument();

    // Check successful result UI
    await waitFor(() => {
      expect(screen.getByText('PRD Content')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByRole('button', { name: 'Folder Structure' })).toBeInTheDocument();
  });

  it('should display error message on API failure', async () => {
    (generateProjectPlanAction as any).mockResolvedValue({
      ok: false,
      error: 'Failed to generate plan',
    });

    render(<ProjectPlanner />);
    
    const input = screen.getByPlaceholderText(/A real-time collaborative markdown editor/i);
    fireEvent.change(input, { target: { value: 'This is a sufficiently long valid idea for a project' } });
    
    const button = screen.getByRole('button', { name: /generate project plan/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to generate plan')).toBeInTheDocument();
      expect(screen.getByText('Generation Error')).toBeInTheDocument();
    });
  });
});
