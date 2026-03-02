import { useMemo, useState } from "react";

const ITEMS = [
  "React",
  "Redux",
  "TypeScript",
  "Tailwind CSS",
  "Jotai",
  "Zustand",
  "JavaScript",
  "Node.js",
  "Next.js",
  "Remix",
  "Vite",
  "Vue",
  "Svelte",
  "Jest",
  "Vitest",
  "Playwright",
  "日本語入力",
  "東京",
  "大阪",
  "京都",
  "かな",
  "カタカナ",
];

export default function CompositionSearch() {
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return ITEMS;
    return ITEMS.filter((item) => item.toLowerCase().includes(normalized));
  }, [keyword]);

  return (
    <div className="w-[430px] rounded-2xl border border-border bg-white p-5 flex flex-col gap-4">
      <h3 className="m-0 font-display text-lg font-bold">
        IME Composition Search
      </h3>
      <p className="m-0 text-sm text-text-secondary">
        While composing Japanese text, search does not run. Search starts only
        after `onCompositionEnd`.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-text-tertiary">
          Search keyword
        </span>
        <input
          type="text"
          value={inputValue}
          placeholder="Type with English or Japanese IME"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            setKeyword(e.currentTarget.value);
          }}
          onChange={(e) => {
            const next = e.target.value;
            setInputValue(next);
            if (!isComposing) {
              setKeyword(next);
            }
          }}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-zinc-400"
        />
      </label>

      <div className="rounded-xl border border-border bg-zinc-50 p-3 flex items-center justify-between text-xs">
        <span className="text-text-tertiary">Composition status</span>
        <strong className={isComposing ? "text-amber-600" : "text-emerald-600"}>
          {isComposing ? "Composing..." : "Committed"}
        </strong>
      </div>

      <div className="rounded-xl border border-border p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">
            Applied keyword:{" "}
            <code className="text-text-primary">{keyword || "(empty)"}</code>
          </span>
          <span className="text-text-tertiary">
            {filteredItems.length} results
          </span>
        </div>

        <ul className="m-0 max-h-44 list-disc space-y-1 overflow-auto pl-5 text-sm text-text-primary">
          {filteredItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
