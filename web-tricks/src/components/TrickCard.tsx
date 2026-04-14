import { Link } from "react-router";
import GithubIcon from "./GithubIcon";
import type { Trick } from "../data/tricks";

interface TrickCardProps {
  trick: Trick;
}

export default function TrickCard({ trick }: TrickCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-page transition-shadow hover:shadow-lg">
      <Link
        to={`/trick/${trick.id}`}
        aria-label={`Open ${trick.title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
      >
        <span className="sr-only">Open {trick.title}</span>
      </Link>

      <div className="pointer-events-none w-full h-[220px] bg-card overflow-hidden">
        <img
          src={trick.thumbnail}
          alt={trick.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="pointer-events-none flex flex-col gap-2.5 px-5 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-[11px] font-semibold text-text-secondary bg-card px-2.5 py-1 rounded-full">
            {trick.category}
          </span>
          <a
            href={trick.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${trick.title} source on GitHub`}
            className="pointer-events-auto relative z-10 text-text-tertiary transition-colors hover:text-text-primary"
          >
            <GithubIcon size={18} />
          </a>
        </div>

        <h3 className="font-display text-lg font-bold text-text-primary tracking-tight m-0">
          {trick.title}
        </h3>

        <p className="font-body text-[13px] text-text-secondary leading-relaxed m-0">
          {trick.description}
        </p>
      </div>
    </article>
  );
}
