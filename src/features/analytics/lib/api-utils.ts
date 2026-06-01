import { NextResponse } from "next/server";

export type APIResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

export function errorResponse(message: string, status = 400, init?: ResponseInit) {
  return NextResponse.json({ ok: false, error: message }, { status, ...init });
}
