import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
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
  const fullscreenMode = trick?.fullscreenMode ?? "fill";
  const shouldRestoreGalleryScroll =
    location.state?.restoreGalleryScroll === true;
  const demoContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayViewportRef = useRef<HTMLDivElement | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isDemoOverlayOpen, setIsDemoOverlayOpen] = useState(false);
  const [overlayScale, setOverlayScale] = useState(1);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(
        document.fullscreenElement === demoContainerRef.current,
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isDemoOverlayOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDemoOverlayOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDemoOverlayOpen]);

  useEffect(() => {
    if (!isDemoOverlayOpen || fullscreenMode !== "scale") {
      return;
    }

    const updateOverlayScale = () => {
      const viewport = overlayViewportRef.current;
      const content = overlayContentRef.current;

      if (!viewport || !content) {
        setOverlayScale(1);
        return;
      }

      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      const horizontalPadding = 24;
      const verticalPadding = 24;

      if (!contentWidth || !contentHeight) {
        setOverlayScale(1);
        return;
      }

      const widthScale = (viewportWidth - horizontalPadding) / contentWidth;
      const heightScale = (viewportHeight - verticalPadding) / contentHeight;
      const nextScale = Math.min(widthScale, heightScale, 1);

      setOverlayScale(
        Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1,
      );
    };

    updateOverlayScale();

    const resizeObserver = new ResizeObserver(updateOverlayScale);

    if (overlayViewportRef.current) {
      resizeObserver.observe(overlayViewportRef.current);
    }

    if (overlayContentRef.current) {
      resizeObserver.observe(overlayContentRef.current);
    }

    window.addEventListener("resize", updateOverlayScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverlayScale);
    };
  }, [fullscreenMode, id, isDemoOverlayOpen]);

  const isDemoFullscreen = isNativeFullscreen || isDemoOverlayOpen;
  const overlayTransform = useMemo(
    () => ({ transform: `scale(${overlayScale})`, transformOrigin: "center" }),
    [overlayScale],
  );

  const handleToggleFullscreen = async () => {
    const demoContainer = demoContainerRef.current;

    if (!demoContainer) {
      return;
    }

    try {
      if (document.fullscreenElement === demoContainer) {
        await document.exitFullscreen();
        return;
      }

      if (isDemoOverlayOpen) {
        setIsDemoOverlayOpen(false);
        return;
      }

      if (
        !document.fullscreenEnabled ||
        typeof demoContainer.requestFullscreen !== "function"
      ) {
        setIsDemoOverlayOpen(true);
        return;
      }

      await demoContainer.requestFullscreen();
    } catch {
      setIsDemoOverlayOpen(true);
    }
  };

  if (!trick || !DemoComponent) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4">
        <p className="text-text-secondary">Trick not found.</p>
      </div>
    );
  }

  const demoContent = (
    <Suspense
      fallback={
        <span className="font-body text-sm text-text-tertiary">
          Loading demo...
        </span>
      }
    >
      <DemoComponent />
    </Suspense>
  );

  const fullscreenButton = (
    <button
      type="button"
      onClick={handleToggleFullscreen}
      aria-label={
        isDemoFullscreen ? "Exit full screen demo" : "Show demo in full screen"
      }
      className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-body text-xs font-semibold text-black shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition-colors hover:bg-white/14"
    >
      {isDemoFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      <span>{isDemoFullscreen ? "Exit full screen" : "Full screen"}</span>
    </button>
  );

  const overlayBackground = (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      onClick={() => setIsDemoOverlayOpen(false)}
    >
      <div className="absolute inset-[-12vh] bg-white/12" />
      <div className="absolute inset-0 backdrop-blur-md" />
      <div className="absolute left-1/2 top-1/2 h-[38vh] w-[38vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_42%,rgba(15,23,42,0.08)_100%)]" />
    </div>
  );

  return (
    <>
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
        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* Demo Area */}
          <div
            ref={demoContainerRef}
            className={`relative flex min-h-[42vh] flex-1 items-center justify-center overflow-auto ${
              isNativeFullscreen
                ? "bg-background p-3 sm:p-4"
                : "bg-card p-4 sm:min-h-[50vh] sm:p-6 lg:p-10 xl:min-h-0 xl:p-12"
            }`}
          >
            {fullscreenButton}
            {!isDemoOverlayOpen && demoContent}
          </div>

          {/* Info Sidebar */}
          <aside className="flex w-full shrink-0 flex-col gap-6 overflow-auto border-t border-border p-5 sm:p-6 lg:p-8 xl:w-[380px] xl:border-t-0 xl:border-l xl:p-8 xl:pt-10">
            <span className="self-start rounded-full bg-card px-3.5 py-1.5 font-display text-xs font-semibold text-text-secondary">
              {trick.category}
            </span>

            <h2 className="m-0 font-display text-[24px] font-extrabold tracking-tight text-text-primary sm:text-[28px]">
              {trick.title}
            </h2>

            <p className="m-0 font-body text-[15px] leading-relaxed text-text-secondary">
              {trick.description}
            </p>

            <div className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <span className="font-display text-[11px] font-bold uppercase tracking-[2px] text-text-tertiary">
                Technologies
              </span>
              <div className="flex flex-wrap gap-2">
                {trick.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border px-3 py-1.5 font-body text-xs font-medium text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {isDemoOverlayOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] h-[100dvh] w-[100vw] overflow-hidden bg-transparent">
            {overlayBackground}
            {fullscreenButton}
            <div
              ref={overlayViewportRef}
              className="pointer-events-none relative z-[1] flex h-[100dvh] w-[100vw] items-center justify-center overflow-hidden"
            >
              {fullscreenMode === "scale" ? (
                <div
                  style={overlayTransform}
                  className="pointer-events-auto will-change-transform"
                >
                  <div
                    ref={overlayContentRef}
                    className="rounded-[28px] border border-white/18 bg-white/8 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.1)] backdrop-blur-md sm:p-3"
                  >
                    {demoContent}
                  </div>
                </div>
              ) : (
                <div
                  ref={overlayContentRef}
                  className="pointer-events-auto h-[100dvh] w-[100vw] [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:rounded-none [&_iframe]:border-0"
                >
                  {demoContent}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
