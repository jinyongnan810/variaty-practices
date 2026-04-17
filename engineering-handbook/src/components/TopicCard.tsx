import { Link } from "react-router";
import type { HandbookPageMeta } from "../data/types";

type TopicCardProps = {
  page: HandbookPageMeta;
};

function TopicCard({ page }: TopicCardProps) {
  return (
    <Link
      to={`/page/${page.slug}`}
      className="group rounded-[24px] border border-border/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(68,49,22,0.05)] transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_24px_80px_rgba(31,92,74,0.12)]"
    >
      <div className="flex flex-wrap gap-2">
        {page.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight transition group-hover:text-accent">
        {page.title}
      </h2>

      <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
        {page.area}
      </p>

      <p className="mt-6 text-sm font-semibold text-accent">Open topic</p>
    </Link>
  );
}

export default TopicCard;
