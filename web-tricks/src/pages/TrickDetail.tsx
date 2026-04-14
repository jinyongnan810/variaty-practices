import { ArrowLeft } from "lucide-react";
import { Suspense, lazy, useLayoutEffect } from "react";
import { Link, useLocation, useParams } from "react-router";
import GithubIcon from "../components/GithubIcon";
import { tricks } from "../data/tricks";

const lazyComponents = Object.fromEntries(
  tricks.map((t) => [t.id, lazy(t.component)]),
);

export default function TrickDetail() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const trick = tricks.find((t) => t.id === id);
  const DemoComponent = id ? lazyComponents[id] : null;
  const shouldRestoreGalleryScroll =
    location.state?.restoreGalleryScroll === true;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [id]);

  if (!trick || !DemoComponent) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4">
        <p className="text-text-secondary">Trick not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col">
      {/* Detail Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6 lg:px-20 lg:py-5">
        <Link
          to="/"
          state={{ restoreGalleryScroll: shouldRestoreGalleryScroll }}
          className="flex items-center gap-3 no-underline text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={20} className="text-text-primary" />
          <span className="font-body text-sm font-medium">
            Back to all tricks
          </span>
        </Link>
        <a
          href={trick.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-dark px-4 py-2 text-text-inverted no-underline transition-opacity hover:opacity-80"
        >
          <GithubIcon size={16} />
          <span className="font-body text-[13px] font-semibold">
            View Source
          </span>
        </a>
      </div>

      {/* Content: Demo + Sidebar */}
      <div className="flex flex-1 flex-col min-h-0 xl:flex-row">
        {/* Demo Area */}
        <div className="flex min-h-[42vh] flex-1 items-center justify-center overflow-auto bg-card p-4 sm:min-h-[50vh] sm:p-6 lg:p-10 xl:min-h-0 xl:p-12">
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
        <aside className="flex w-full shrink-0 flex-col gap-6 overflow-auto border-t border-border p-5 sm:p-6 lg:p-8 xl:w-[380px] xl:border-t-0 xl:border-l xl:p-8 xl:pt-10">
          <span className="font-display text-xs font-semibold text-text-secondary bg-card px-3.5 py-1.5 rounded-full self-start">
            {trick.category}
          </span>

          <h2 className="m-0 font-display text-[24px] font-extrabold tracking-tight text-text-primary sm:text-[28px]">
            {trick.title}
          </h2>

          <p className="m-0 font-body text-[15px] leading-relaxed text-text-secondary">
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
