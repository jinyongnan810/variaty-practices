import { Link } from "react-router";
import GithubIcon from "./GithubIcon";
import type { Trick } from "../data/tricks";

const GALLERY_SCROLL_POSITION_KEY = "gallery-scroll-position";

interface TrickCardProps {
  trick: Trick;
}

export default function TrickCard({ trick }: TrickCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-page transition-shadow hover:shadow-lg">
      <Link
        to={`/trick/${trick.id}`}
        state={{ restoreGalleryScroll: true }}
        aria-label={`Open ${trick.title}`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
        onClick={() => {
          window.sessionStorage.setItem(
            GALLERY_SCROLL_POSITION_KEY,
            String(window.scrollY),
          );
        }}
      >
        <span className="sr-only">Open {trick.title}</span>
      </Link>

      <div className="pointer-events-none h-48 w-full overflow-hidden bg-card sm:h-[220px]">
        <img
          src={trick.thumbnail}
          alt={trick.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="pointer-events-none flex flex-col gap-2.5 px-4 pt-4 pb-5 sm:px-5">
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

        <h3 className="m-0 font-display text-base font-bold tracking-tight text-text-primary sm:text-lg">
          {trick.title}
        </h3>

        <p className="m-0 font-body text-[13px] leading-relaxed text-text-secondary">
          {trick.description}
        </p>
      </div>
    </article>
  );
}
