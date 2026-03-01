import { Link } from "react-router";
import { Github } from "lucide-react";
import type { Trick } from "../data/tricks";

interface TrickCardProps {
  trick: Trick;
}

export default function TrickCard({ trick }: TrickCardProps) {
  return (
    <Link
      to={`/trick/${trick.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-page overflow-hidden no-underline transition-shadow hover:shadow-lg"
    >
      <div className="w-full h-[220px] bg-card overflow-hidden">
        <img
          src={trick.thumbnail}
          alt={trick.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2.5 px-5 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-[11px] font-semibold text-text-secondary bg-card px-2.5 py-1 rounded-full">
            {trick.category}
          </span>
          <a
            href={trick.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={18} />
          </a>
        </div>

        <h3 className="font-display text-lg font-bold text-text-primary tracking-tight m-0">
          {trick.title}
        </h3>

        <p className="font-body text-[13px] text-text-secondary leading-relaxed m-0">
          {trick.description}
        </p>
      </div>
    </Link>
  );
}
