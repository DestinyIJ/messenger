import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if(!email || !name || password) {
        const error: any = new Error("Registration requires email, name, and password");
        error.status = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {email, name, hashedPassword}
    });

    return NextResponse.json(user);
  } catch (error:any) {
    const status = error.status || 400;
    const message = error.message || "An error occurred";

    return new NextResponse(message, { status });
  }
}