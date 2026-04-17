import { Link } from "react-router";
import LocalOnly from "./LocalOnly";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-page/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <Link to="/" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
            Engineering Handbook
          </p>
          <p className="mt-1 truncate font-display text-lg font-bold tracking-tight">
            Study pages for math, algebra, algorithms, and statistics
          </p>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium text-text-secondary">
          <Link
            to="/"
            className="rounded-full border border-border bg-white/60 px-4 py-2 transition hover:bg-panel/55"
          >
            Library
          </Link>
          <LocalOnly>
            <Link
              to="/local/edit"
              className="rounded-full border border-[#13392f] bg-[#174d3d] px-4 py-2 text-white shadow-[0_10px_24px_rgba(23,77,61,0.28)] transition hover:bg-[#123d31]"
            >
              Local Editor
            </Link>
          </LocalOnly>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;
