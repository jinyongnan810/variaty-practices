import { useLayoutEffect, useMemo } from "react";
import { useLocation } from "react-router";
import TrickCard from "../components/TrickCard";
import { tricks } from "../data/tricks";
import type { Category } from "../App";

const GALLERY_SCROLL_POSITION_KEY = "gallery-scroll-position";

interface GalleryProps {
  filter: Category;
}

export default function Gallery({ filter }: GalleryProps) {
  const location = useLocation();
  const filtered = useMemo(
    () =>
      filter === "All" ? tricks : tricks.filter((t) => t.category === filter),
    [filter],
  );

  useLayoutEffect(() => {
    if (location.state?.restoreGalleryScroll !== true) {
      return;
    }

    const savedScrollPosition = window.sessionStorage.getItem(
      GALLERY_SCROLL_POSITION_KEY,
    );

    if (!savedScrollPosition) {
      return;
    }

    window.scrollTo({ top: Number(savedScrollPosition), left: 0 });
    window.sessionStorage.removeItem(GALLERY_SCROLL_POSITION_KEY);
  }, [location.key, location.state]);

  return (
    <main>
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-20 lg:pt-20 lg:pb-16">
        <h1 className="m-0 text-center font-display text-3xl font-black tracking-[-1px] text-text-primary sm:text-4xl lg:text-5xl lg:tracking-[-2px]">
          Tiny tricks, big impact.
        </h1>
        <p className="m-0 max-w-[600px] text-center font-body text-base leading-relaxed text-text-secondary sm:text-lg">
          A curated collection of CSS, JavaScript & React snippets you can learn
          in minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-center sm:gap-6 lg:gap-8 lg:pt-6">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-black text-text-primary">
              {tricks.length}
            </span>
            <span className="font-body text-sm text-text-tertiary">tricks</span>
          </div>
          <span className="hidden text-2xl text-text-tertiary sm:inline">
            ·
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-black text-text-primary">
              3
            </span>
            <span className="font-body text-sm text-text-tertiary">
              categories
            </span>
          </div>
          <span className="hidden text-2xl text-text-tertiary sm:inline">
            ·
          </span>
          <span className="font-body text-sm font-medium text-text-secondary">
            open source
          </span>
        </div>
      </section>

      {/* Grid Section */}
      <section className="flex flex-col gap-6 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-20 lg:pb-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="m-0 font-display text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
            {filter === "All" ? "Browse Tricks" : filter}
          </h2>
          <span className="font-body text-sm text-text-tertiary">
            {filtered.length} {filtered.length === 1 ? "trick" : "tricks"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
          {filtered.map((trick) => (
            <TrickCard key={trick.id} trick={trick} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-text-tertiary font-body text-sm py-12">
            No tricks in this category yet.
          </p>
        )}
      </section>
    </main>
  );
}
