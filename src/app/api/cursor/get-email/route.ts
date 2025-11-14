import { NextResponse } from "next/server";
import { transportUnary } from "../transport";


export async function POST(request: Request) {
  const { token, traceparent } = await request.json();

  try {
    const cfg = {
      traceparent
    };
    const res = await transportUnary(token, cfg, 'aiserver.v1.AuthService', 'getEmail');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}  