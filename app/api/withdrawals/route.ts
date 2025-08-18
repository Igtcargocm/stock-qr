import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const itemSchema = z.object({
  giftId: z.string().min(1),
  qty: z.number().int().positive()
});
const schema = z.object({
  salesRepId: z.string().min(1),
  items: z.array(itemSchema).min(1)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  const { salesRepId, items } = parsed.data;

  // Validar stock y descontar en transacción
  const result = await prisma.$transaction(async (tx) => {
    // Chequear existencias
    for (const it of items) {
      const g = await tx.gift.findUnique({ where: { id: it.giftId } });
      if (!g) throw new Error(`Gift ${it.giftId} no existe`);
      if (g.stock < it.qty) throw new Error(`Stock insuficiente de ${g.name} (restan ${g.stock})`);
    }

    const withdrawal = await tx.withdrawal.create({
      data: {
        salesRepId,
        items: {
          create: items.map(it => ({ giftId: it.giftId, qty: it.qty }))
        }
      },
      include: { items: true }
    });

    for (const it of items) {
      await tx.gift.update({
        where: { id: it.giftId },
        data: { stock: { decrement: it.qty } }
      });
    }

    return withdrawal;
  });

  return NextResponse.json(result, { status: 201 });
}
