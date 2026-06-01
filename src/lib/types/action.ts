/**
 * Standardized response type for all Server Actions.
 * Use this to ensure consistent error handling across the application.
 */
export type ActionResponse<T = void> = 
  | { ok: true; data: T }
  | { ok: false; error: string };
