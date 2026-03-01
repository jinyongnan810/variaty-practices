import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  saving?: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: "Design the landing page", done: true },
  { id: 2, text: "Implement dark mode", done: false },
  { id: 3, text: "Write unit tests", done: false },
  { id: 4, text: "Deploy to production", done: false },
];

function simulateServer(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

export default function OptimisticUI() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [log, setLog] = useState<string[]>([]);

  const toggle = async (id: number) => {
    // Optimistically update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done, saving: true } : t
      )
    );
    setLog((l) => [...l.slice(-3), `Toggled #${id} (optimistic)`]);

    // Simulate server
    await simulateServer();

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, saving: false } : t))
    );
    setLog((l) => [...l.slice(-3), `Server confirmed #${id}`]);
  };

  return (
    <div className="w-[380px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
        <h3 className="font-display text-lg font-bold m-0">
          Optimistic UI Updates
        </h3>
        <p className="text-sm text-text-secondary m-0">
          Click a todo — it toggles instantly, then syncs with the "server"
          after 1.5s.
        </p>

        <div className="flex flex-col gap-2">
          {todos.map((todo) => (
            <button
              key={todo.id}
              onClick={() => toggle(todo.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-left transition-colors ${
                todo.done
                  ? "bg-card border-border"
                  : "bg-white border-border hover:bg-zinc-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  todo.done
                    ? "bg-dark border-dark"
                    : "bg-transparent border-zinc-300"
                }`}
              >
                {todo.done && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm flex-1 ${
                  todo.done
                    ? "line-through text-text-tertiary"
                    : "text-text-primary"
                }`}
              >
                {todo.text}
              </span>
              {todo.saving && (
                <span className="text-[10px] text-text-tertiary font-medium animate-pulse">
                  syncing...
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Activity Log
          </span>
          {log.map((entry, i) => (
            <span key={i} className="text-xs font-mono text-zinc-400">
              → {entry}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
