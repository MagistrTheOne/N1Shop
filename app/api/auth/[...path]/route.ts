import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/server";

type AuthHandlers = ReturnType<ReturnType<typeof getAuth>["handler"]>;
type AuthContext = Parameters<AuthHandlers["GET"]>[1];
type AuthMethod = keyof AuthHandlers;

function forward(method: AuthMethod) {
  return async (request: Request, context: AuthContext) => {
    try {
      return await getAuth().handler()[method](request, context);
    } catch {
      return NextResponse.json({ message: "Authentication service is unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
  };
}

export const GET = forward("GET");
export const POST = forward("POST");
export const PUT = forward("PUT");
export const PATCH = forward("PATCH");
export const DELETE = forward("DELETE");
