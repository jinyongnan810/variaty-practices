import { Link, useLocation } from "react-router";
import { Github } from "lucide-react";
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
    <header className="flex items-center justify-between px-20 py-5 border-b border-border">
      <Link
        to="/"
        className="flex items-center gap-3 no-underline"
        onClick={() => onFilterChange("All")}
      >
        <div className="w-8 h-8 bg-dark rounded-lg flex items-center justify-center">
          <span className="text-text-inverted font-display text-sm font-bold">
            {"</>"}
          </span>
        </div>
        <span className="font-display text-xl font-extrabold text-text-primary tracking-tight">
          Web Tricks
        </span>
      </Link>

      <nav className="flex items-center gap-8">
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
        <a
          href="https://github.com/jinyongnan810/variaty-practices/tree/main/web-tricks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-text-secondary transition-colors"
        >
          <Github size={20} />
        </a>
      </nav>
    </header>
  );
}
