import { AIProviderError } from "@/features/prompts/providers/types";

type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
};

export async function withRetry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 400;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt === retries) {
        throw error;
      }

      await delay(baseDelayMs * 2 ** attempt);
    }
  }

  throw lastError;
}

function isRetryable(error: unknown) {
  return error instanceof AIProviderError ? error.retryable : false;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
