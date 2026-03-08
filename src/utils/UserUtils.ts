import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { UserToken } from "@/types/UserToken";
import { jwtVerify } from "jose";

export async function getServerAuthUser(): Promise<UserToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string") {
      return null;
    }

    return decoded as UserToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function getMiddlewareAuthUser(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (error: unknown) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
