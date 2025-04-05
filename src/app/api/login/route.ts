import bcrypt from 'bcrypt';
import prismaClient from "@/app/lib/db";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate the email and password
    const user = await prismaClient.user.findUnique({ where: { email } });
    console.log("user",user);
    console.log("input password",password);

    if (!user) {
      return NextResponse.json({ ok: false, message: 'User not found, Please Register' }, { status: 400 });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("password",isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ ok: false, message: 'Invalid password' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json({ ok: false, message: 'An error occurred' }, { status: 500 });
  }
}
