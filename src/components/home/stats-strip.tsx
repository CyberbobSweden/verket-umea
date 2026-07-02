/**
 * Deliberately qualitative, not quantitative — we don't have verified
 * member/event counts from the association yet. Swap these for real
 * numbers (e.g. pulled from `profiles` / `events` counts) once the
 * board confirms them; presenting invented stats as fact would be
 * misleading on a real nonprofit's site.
 */
const POINTS = [
  { value: 'Ideell', label: 'Driven av medlemmar' },
  { value: 'Umeå', label: 'Mitt i stan, Götgatan 2' },
  { value: 'Alkoholfritt', label: 'Fokus på musik & community' },
  { value: 'Volontärdrivet', label: 'Allt görs av folk som ställer upp' },
];

export function StatsStrip() {
  return (
    <section className="border-y border-white/10 bg-graphite/50">
      <div className="container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {POINTS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-2xl font-bold text-gradient sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-mist">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
