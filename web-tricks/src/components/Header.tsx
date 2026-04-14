import { Link, useLocation } from "react-router";
import GithubIcon from "./GithubIcon";
import type { Category } from "../App";

const categories: { label: string; value: Category }[] = [
  { label: "All", value: "All" },
  { label: "CSS", value: "CSS" },
  { label: "JavaScript", value: "JS" },
  { label: "React", value: "React" },
];

interface HeaderProps {
  filter: Category;
  onFilterChange: (cat: Category) => void;
}

export default function Header({ filter, onFilterChange }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-20 lg:py-5">
      <div className="flex items-center justify-between gap-4 lg:min-w-0">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 no-underline"
          onClick={() => onFilterChange("All")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark">
            <span className="font-display text-sm font-bold text-text-inverted">
              {"</>"}
            </span>
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-text-primary">
            Web Tricks
          </span>
        </Link>
        <a
          href="https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-text-primary transition-colors hover:text-text-secondary"
        >
          <GithubIcon size={20} />
        </a>
      </div>

      <nav className="flex w-full flex-wrap items-center gap-x-5 gap-y-3 lg:w-auto lg:justify-end lg:gap-8">
        {isHome &&
          categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange(cat.value)}
              className={`font-body text-sm cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                filter === cat.value
                  ? "font-semibold text-text-primary"
                  : "font-medium text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
      </nav>
    </header>
  );
}
