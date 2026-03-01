import { ArrowLeft, X } from "lucide-react";
import { Suspense, lazy } from "react";
import { Link, useParams } from "react-router";
import GithubIcon from "../components/GithubIcon";
import { tricks } from "../data/tricks";

const lazyComponents = Object.fromEntries(
  tricks.map((t) => [t.id, lazy(t.component)]),
);

export default function TrickDetail() {
  const { id } = useParams<{ id: string }>();
  const trick = tricks.find((t) => t.id === id);
  const DemoComponent = id ? lazyComponents[id] : null;

  if (!trick || !DemoComponent) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-65px)]">
        <p className="text-text-secondary">Trick not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      {/* Detail Header */}
      <div className="flex items-center justify-between px-20 py-5 border-b border-border">
        <Link
          to="/"
          className="flex items-center gap-3 no-underline text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={20} className="text-text-primary" />
          <span className="font-body text-sm font-medium">
            Back to all tricks
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href={trick.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-dark text-text-inverted px-4 py-2 rounded-lg no-underline hover:opacity-80 transition-opacity"
          >
            <GithubIcon size={16} />
            <span className="font-body text-[13px] font-semibold">
              View Source
            </span>
          </a>
          <Link
            to="/"
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </Link>
        </div>
      </div>

      {/* Content: Demo + Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Demo Area */}
        <div className="flex-1 bg-card flex items-center justify-center p-12 overflow-auto">
          <Suspense
            fallback={
              <span className="text-text-tertiary font-body text-sm">
                Loading demo...
              </span>
            }
          >
            <DemoComponent />
          </Suspense>
        </div>

        {/* Info Sidebar */}
        <aside className="w-[380px] shrink-0 border-l border-border p-8 pt-10 flex flex-col gap-6 overflow-auto">
          <span className="font-display text-xs font-semibold text-text-secondary bg-card px-3.5 py-1.5 rounded-full self-start">
            {trick.category}
          </span>

          <h2 className="font-display text-[28px] font-extrabold text-text-primary tracking-tight m-0">
            {trick.title}
          </h2>

          <p className="font-body text-[15px] text-text-secondary leading-relaxed m-0">
            {trick.description}
          </p>

          <div className="w-full h-px bg-border" />

          <div className="flex flex-col gap-3">
            <span className="font-display text-[11px] font-bold text-text-tertiary tracking-[2px] uppercase">
              Technologies
            </span>
            <div className="flex flex-wrap gap-2">
              {trick.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-xs font-medium text-text-secondary border border-border px-3 py-1.5 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
