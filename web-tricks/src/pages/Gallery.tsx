import TrickCard from "../components/TrickCard";
import { tricks } from "../data/tricks";

export default function Gallery() {
  return (
    <main>
      {/* Hero */}
      <section className="flex flex-col items-center px-20 pt-20 pb-16 gap-4">
        <h1 className="font-display text-5xl font-black text-text-primary tracking-[-2px] text-center m-0">
          Tiny tricks, big impact.
        </h1>
        <p className="font-body text-lg text-text-secondary text-center max-w-[600px] leading-relaxed m-0">
          A curated collection of CSS, JavaScript & React snippets you can learn
          in minutes.
        </p>
        <div className="flex items-center gap-8 pt-6">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-black text-text-primary">
              {tricks.length}
            </span>
            <span className="font-body text-sm text-text-tertiary">tricks</span>
          </div>
          <span className="text-2xl text-text-tertiary">·</span>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-black text-text-primary">
              3
            </span>
            <span className="font-body text-sm text-text-tertiary">
              categories
            </span>
          </div>
          <span className="text-2xl text-text-tertiary">·</span>
          <span className="font-body text-sm font-medium text-text-secondary">
            open source
          </span>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-20 pb-20 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold text-text-primary tracking-tight m-0">
            Browse Tricks
          </h2>
          <span className="font-body text-sm text-text-tertiary">
            {tricks.length} tricks
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {tricks.map((trick) => (
            <TrickCard key={trick.id} trick={trick} />
          ))}
        </div>
      </section>
    </main>
  );
}
