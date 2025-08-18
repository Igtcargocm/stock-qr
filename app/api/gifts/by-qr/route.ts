import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({ qr: z.string().min(1) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'QR inválido' }, { status: 400 });

  const gift = await prisma.gift.findUnique({ where: { qr: parsed.data.qr } });
  if (!gift) return NextResponse.json({ error: 'Regalo no encontrado' }, { status: 404 });

  return NextResponse.json(gift);
}
