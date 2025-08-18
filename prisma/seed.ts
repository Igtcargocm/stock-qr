import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.gift.createMany({
    data: [
      { name: 'Llavero metálico', sku: 'LLAV-001', stock: 100, qr: 'gift:LLAV-001' },
      { name: 'Taza corporativa', sku: 'TAZA-002', stock: 60, qr: 'gift:TAZA-002' },
      { name: 'Cuaderno A5', sku: 'CUAD-003', stock: 80, qr: 'gift:CUAD-003' },
    ],
    skipDuplicates: true
  });

  await prisma.salesRep.create({
    data: { name: 'Comercial Demo', email: 'comercial@demo.com' },
  });
}

main().finally(() => prisma.$disconnect());
