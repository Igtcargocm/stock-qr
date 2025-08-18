import fs from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const items = [
  { name: 'Llavero metálico', qr: 'gift:LLAV-001' },
  { name: 'Taza corporativa', qr: 'gift:TAZA-002' },
  { name: 'Cuaderno A5', qr: 'gift:CUAD-003' },
];

(async () => {
  const out = path.join(process.cwd(), 'qrs');
  await fs.mkdir(out, { recursive: true });
  for (const it of items) {
    const p = path.join(out, `${it.qr.replace(':','_')}.png`);
    await QRCode.toFile(p, it.qr, { width: 512, margin: 2 });
    console.log('QR generado:', p);
  }
})();
