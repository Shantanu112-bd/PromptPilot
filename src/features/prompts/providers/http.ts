import { AIProviderError, type AIProviderName } from "@/features/prompts/providers/types";

export async function parseProviderResponse<T>(response: Response, provider: AIProviderName): Promise<T> {
  const body = await readJsonSafely(response);

  if (!response.ok) {
    throw new AIProviderError(
      getProviderErrorMessage(body, response.statusText),
      provider,
      response.status,
      response.status === 429 || response.status >= 500,
      body
    );
  }

  return body as T;
}

export function assertApiKey(apiKey: string | undefined, provider: AIProviderName) {
  if (!apiKey) {
    throw new AIProviderError(`Missing API key for ${provider}.`, provider, undefined, false);
  }
}

async function readJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getProviderErrorMessage(body: unknown, fallback: string) {
  if (isObject(body)) {
    const error = body.error;

    if (typeof error === "string") {
      return error;
    }

    if (isObject(error) && typeof error.message === "string") {
      return error.message;
    }

    if (typeof body.message === "string") {
      return body.message;
    }
  }

  return fallback || "AI provider request failed.";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Wraps native fetch with an AbortController timeout.
 * All AI provider calls should use this instead of raw fetch()
 * to prevent indefinite hangs on slow or unresponsive APIs.
 */
export function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timer);
  });
}
