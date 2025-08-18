import { prisma } from '@/lib/prisma';

export default async function GiftsAdmin() {
  const gifts = await prisma.gift.findMany({ orderBy: { name: 'asc' } });

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1>Regalos</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th style={{textAlign:'left'}}>Nombre</th><th>SKU</th><th>Stock</th><th>QR</th></tr>
        </thead>
        <tbody>
          {gifts.map(g => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td style={{ textAlign: 'center' }}>{g.sku}</td>
              <td style={{ textAlign: 'center' }}>{g.stock}</td>
              <td>{g.qr}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 12 }}>Tip: imprime QR con el contenido exacto del campo <code>qr</code> (p.ej. “gift:LLAV-001”).</p>
    </main>
  );
}
