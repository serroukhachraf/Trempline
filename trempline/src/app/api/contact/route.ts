import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Une simple validation du format email "test@test.com"
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation d'email
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // validation du numéro | Note : une autre option c'est l'acceptation du +
    if (!/^\+?\d+$/.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number should contain only numbers.' },
        { status: 400 }
      );
    }

    // Enrigstrement dans la base de données.
    const contact = await prisma.contactMessage.create({
      data: {
        gender: body.gender,
        lastName: body.lastName,
        firstName: body.firstName,
        email: body.email,
        phone: body.phone,
        messageType: body.messageType,
        message: body.message,
        availabilities: JSON.stringify(body.availabilities),
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
