import { useState, useEffect, useCallback } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export default function UseLocalStorageDemo() {
  const [name, setName] = useLocalStorage("demo-name", "");
  const [count, setCount] = useLocalStorage("demo-count", 0);
  const [dark, setDark] = useLocalStorage("demo-dark", false);

  const reset = useCallback(() => {
    setName("");
    setCount(0);
    setDark(false);
  }, [setName, setCount, setDark]);

  return (
    <div
      className={`w-[400px] rounded-2xl border p-6 flex flex-col gap-4 transition-colors ${
        dark
          ? "bg-zinc-900 border-zinc-700 text-white"
          : "bg-white border-border text-text-primary"
      }`}
    >
      <h3 className="font-display text-lg font-bold m-0">
        useLocalStorage Hook
      </h3>
      <p
        className={`text-sm m-0 ${
          dark ? "text-zinc-400" : "text-text-secondary"
        }`}
      >
        Values persist across page refreshes. Try editing and reloading!
      </p>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium opacity-60">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name..."
            className={`px-3 py-2 rounded-lg border text-sm outline-none ${
              dark
                ? "bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500"
                : "bg-card border-border text-text-primary placeholder:text-text-tertiary"
            }`}
          />
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm">
            Count: <strong className="font-display">{count}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCount((c) => c - 1)}
              className={`w-8 h-8 rounded-lg border text-sm font-bold cursor-pointer ${
                dark
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-card border-border"
              }`}
            >
              -
            </button>
            <button
              onClick={() => setCount((c) => c + 1)}
              className={`w-8 h-8 rounded-lg border text-sm font-bold cursor-pointer ${
                dark
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-card border-border"
              }`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Dark mode</span>
          <button
            onClick={() => setDark((d) => !d)}
            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
              dark ? "bg-white" : "bg-zinc-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                dark ? "left-[18px] bg-zinc-900" : "left-0.5 bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={reset}
        className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          dark
            ? "bg-zinc-700 text-white hover:bg-zinc-600 border-0"
            : "bg-card border border-border hover:bg-zinc-200"
        }`}
      >
        Reset all
      </button>
    </div>
  );
}
