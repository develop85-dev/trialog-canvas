import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/kirish")({
  head: () => ({
    meta: [
      { title: "Kirish — TRIALOG" },
      { name: "description", content: "TRIALOG elektron platformasiga kirish." },
      { property: "og:title", content: "TRIALOG platformasiga kirish" },
      { property: "og:description", content: "Talaba, o‘qituvchi va administratorlar uchun kirish." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-lift">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="font-display mt-6 text-3xl text-primary">Platformaga kirish</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Kirish va ro‘yxatdan o‘tish tizimi keyingi bosqichda ulanadi.
        </p>
      </div>
    </section>
  );
}
