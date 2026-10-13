export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="academic-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-4xl text-primary md:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {lead}
        </p>
      </div>
    </section>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-5xl px-6 py-16">{children}</section>;
}
