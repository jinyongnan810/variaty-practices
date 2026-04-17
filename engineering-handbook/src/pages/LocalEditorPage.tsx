import { Link } from "react-router";

function LocalEditorPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-8 lg:px-12">
      <div className="rounded-[28px] border border-border/80 bg-surface/90 p-8 shadow-[0_24px_80px_rgba(68,49,22,0.08)] backdrop-blur sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
          Local Utility Stub
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Export and preview tools will live here.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
          Phase 1 only creates the route shell. Hostname gating, markdown
          preview, and file export logic will come later.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex w-fit items-center rounded-full border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-text-primary transition hover:bg-panel/60"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}

export default LocalEditorPage;
