export default function ScrollAnimations() {
  return (
    <div className="w-[400px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display text-lg font-bold m-0 mb-2">
          Scroll-Driven Animations
        </h3>
        <p className="text-sm text-text-secondary m-0 mb-4">
          Scroll down in this box to see elements animate in using pure CSS{" "}
          <code className="bg-card px-1 rounded text-xs">animation-timeline</code>.
        </p>
      </div>

      <div className="h-[200px] overflow-y-auto rounded-2xl border border-border bg-white">
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .scroll-animate {
            animation: fadeSlideIn linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 100%;
          }
        `}</style>
        <div className="p-5 flex flex-col gap-6">
          {["Design", "Develop", "Deploy", "Iterate", "Scale", "Ship"].map(
            (word, i) => (
              <div
                key={word}
                className="scroll-animate flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
                  style={{
                    backgroundColor: [
                      "#6366f1",
                      "#ec4899",
                      "#f59e0b",
                      "#10b981",
                      "#3b82f6",
                      "#8b5cf6",
                    ][i],
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-display font-bold text-sm m-0">{word}</p>
                  <p className="text-xs text-text-tertiary m-0">
                    Step {i + 1} of the workflow
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
