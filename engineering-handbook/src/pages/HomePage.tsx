import { Link } from "react-router";

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-12">
      <div className="rounded-[32px] border border-border/80 bg-surface/90 p-8 shadow-[0_24px_80px_rgba(68,49,22,0.08)] backdrop-blur sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
          Engineering Handbook
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Static study pages for algebra, algorithms, statistics, and math.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
          Phase 1 scaffold is in place. Next steps are content generation,
          markdown loading, topic pages, and localhost-only export tooling.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/page/example-topic"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View Route Stub
          </Link>
          <Link
            to="/local/edit"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-panel/60"
          >
            Local Editor Stub
          </Link>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
