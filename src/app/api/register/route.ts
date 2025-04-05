import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prismaClient from "@/app/lib/db"; // Assuming prisma is already set up in your app

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, email, password } = body;

    // Check if the email is already registered
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.registered) {
      return NextResponse.json({
        ok: false,
        message: 'Email already in use. Please login instead.',
      });
    }
    
    let newUser;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    if(existingUser && !existingUser.registered)
    {
       newUser = await prismaClient.user.update({
        where: { email }, // Identify the user by their email
        data: {
          password: hashedPassword, // Set the new hashed password
          registered: true, // Mark the user as registered
        },
      });
    }
    else{
    // Create a new user in the database
    newUser = await prismaClient.user.create({
      data: {
        name: userName,
        email,
        password: hashedPassword,
        registered: true, 
        provider: "CREDENTIALS",
      },
    });
  }

    return NextResponse.json({
      ok: true,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration Error:', error);

    return NextResponse.json({
      ok: false,
      message: 'An error occurred while registering. Please try again later.',
    });
  }
}
