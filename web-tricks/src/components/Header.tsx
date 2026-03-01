import { Link, useLocation } from "react-router";
import { Github } from "lucide-react";

const categories = ["All", "CSS", "JavaScript", "React"] as const;

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="flex items-center justify-between px-20 py-5 border-b border-border">
      <Link to="/" className="flex items-center gap-3 no-underline">
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
            <span
              key={cat}
              className={`font-body text-sm cursor-pointer transition-colors ${
                cat === "All"
                  ? "font-semibold text-text-primary"
                  : "font-medium text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </span>
          ))}
        <a
          href="https://github.com"
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
