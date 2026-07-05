export function StatCounter({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-mono text-3xl font-medium tracking-[-0.02em] text-brand sm:text-4xl">{stat.value}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
