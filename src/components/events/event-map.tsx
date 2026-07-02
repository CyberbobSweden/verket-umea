export function EventMap({ lat, lng, address }: { lat: number | null; lng: number | null; address: string | null }) {
  if (lat == null || lng == null) return null;

  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <iframe
        title={`Karta: ${address ?? 'Verket Umeå'}`}
        src={src}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
