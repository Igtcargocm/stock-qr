'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

type Gift = { id: string; name: string; sku: string; stock: number; qr: string };

export default function Home() {
  const [gift, setGift] = useState<Gift | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [salesRepId, setSalesRepId] = useState<string>(''); // MVP: input manual

  const onScan = async (codes: { rawValue: string }[]) => {
    const raw = codes?.[0]?.rawValue;
    if (!raw) return;

    const res = await fetch('/api/gifts/by-qr', {
      method: 'POST',
      body: JSON.stringify({ qr: raw }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) setGift(data);
    else alert(data.error || 'No se encontró el regalo');
  };

  const confirm = async () => {
    if (!gift || !salesRepId) {
      alert('Completa Comercial y escanea un regalo primero');
      return;
    }
    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salesRepId, items: [{ giftId: gift.id, qty }] })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Error al registrar retiro');
    alert('Retiro registrado');
    setGift(null);
    setQty(1);
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>Retiro de regalos</h1>

      <label>Comercial (ID)</label>
      <input
        value={salesRepId}
        onChange={e => setSalesRepId(e.target.value)}
        placeholder="Ingresa ID (luego conectamos login)"
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />

      <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <Scanner onScan={onScan} components={{ finder: true }} />
      </div>

      {gift && (
        <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
          <h3>{gift.name}</h3>
          <p>SKU: {gift.sku} — Stock: {gift.stock}</p>
          <label>Cantidad a retirar</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={e => setQty(parseInt(e.target.value || '1', 10))}
            style={{ width: 120, padding: 8, marginRight: 8 }}
          />
          <button onClick={confirm} style={{ padding: '8px 14px' }}>Confirmar retiro</button>
        </div>
      )}
    </main>
  );
}
