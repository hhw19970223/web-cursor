import { NextResponse } from "next/server";
import { transport } from "../transport";


export async function POST(request: Request) {
  const { token, traceparent } = await request.json();

  try {
    const res = await transport(token, traceparent, 'aiserver.v1.AuthService', 'getEmail');
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}  
