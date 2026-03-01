import { useState } from "react";

export default function ContainerQueries() {
  const [width, setWidth] = useState(400);

  return (
    <div className="flex flex-col gap-4 w-[480px]">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display text-lg font-bold m-0 mb-1">
          Container Queries
        </h3>
        <p className="text-sm text-text-secondary m-0 mb-4">
          Drag the slider to resize the container. The card layout adapts based
          on container width, not viewport.
        </p>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary font-mono">200px</span>
          <input
            type="range"
            min={200}
            max={480}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="flex-1 accent-dark"
          />
          <span className="text-xs text-text-tertiary font-mono">480px</span>
        </div>
        <p className="text-xs text-text-tertiary text-center mt-2 m-0">
          Current: <strong className="text-text-primary">{width}px</strong>
        </p>
      </div>

      <style>{`
        .cq-container {
          container-type: inline-size;
        }
        .cq-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @container (min-width: 350px) {
          .cq-card {
            flex-direction: row;
            align-items: center;
          }
          .cq-card .cq-avatar {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>

      <div
        className="cq-container border border-border rounded-2xl p-4 bg-white transition-all overflow-hidden mx-auto"
        style={{ width }}
      >
        <div className="cq-card">
          <div className="cq-avatar w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shrink-0" />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-display font-bold text-sm truncate">
              Sarah Chen
            </span>
            <span className="text-xs text-text-secondary truncate">
              Senior Frontend Engineer
            </span>
            <span className="text-xs text-text-tertiary">
              Joined 2024 · 48 contributions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
