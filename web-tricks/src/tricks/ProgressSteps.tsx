import { useMemo, useState } from "react";

const steps = ["1", "2", "3", "4"];

export default function ProgressSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  const progressWidth = useMemo(
    () => `${(currentStep / (steps.length - 1)) * 100}%`,
    [currentStep],
  );

  return (
    <div className="w-[420px] rounded-2xl border border-border bg-white p-6">
      <style>{`
        .progress-steps-line {
          --line-fill-color: #34989b;
          --line-not-fill-color: #e0e0e0;
          position: relative;
        }
        .progress-steps-line::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 4px;
          transform: translateY(-50%);
          background-color: var(--line-not-fill-color);
          z-index: 0;
        }
      `}</style>

      <h3 className="m-0 mb-1 font-display text-lg font-bold">
        Progress Steps
      </h3>
      <p className="m-0 mb-5 text-sm text-text-secondary">
        Multi-step progress indicator with previous/next controls.
      </p>

      <div className="progress-steps-line mb-6 flex items-center justify-between">
        <div
          className="absolute left-0 top-1/2 z-[1] h-1 -translate-y-1/2 bg-[#34989b] transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          return (
            <div
              key={step}
              className="relative z-[2] flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] bg-white text-sm transition-colors duration-500"
              style={{
                borderColor: isActive ? "#34989b" : "#e0e0e0",
                color: isActive ? "#111827" : "#9ca3af",
              }}
            >
              {step}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          className="rounded-md border-0 px-4 py-2 text-sm text-white transition enabled:bg-[#34989b] enabled:hover:brightness-95 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#e0e0e0]"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={currentStep === steps.length - 1}
          onClick={() =>
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
          }
          className="rounded-md border-0 px-4 py-2 text-sm text-white transition enabled:bg-[#34989b] enabled:hover:brightness-95 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#e0e0e0]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
