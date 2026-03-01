import { useEffect, useRef, useState } from "react";

function FadeInBox({ label, color, delay }: { label: string; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl p-4 flex items-center gap-3 transition-all duration-700"
      style={{
        backgroundColor: color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-8 h-8 bg-white/30 rounded-lg" />
      <span className="text-white font-display font-semibold text-sm">
        {label}
      </span>
    </div>
  );
}

export default function IntersectionObserverDemo() {
  const items = [
    { label: "Hero Image", color: "#6366f1" },
    { label: "Feature Card", color: "#ec4899" },
    { label: "Testimonial", color: "#f59e0b" },
    { label: "Pricing Table", color: "#10b981" },
    { label: "Footer CTA", color: "#3b82f6" },
    { label: "Newsletter", color: "#8b5cf6" },
    { label: "Social Proof", color: "#ef4444" },
    { label: "FAQ Section", color: "#14b8a6" },
  ];

  return (
    <div className="w-[360px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display text-lg font-bold m-0 mb-1">
          Intersection Observer
        </h3>
        <p className="text-sm text-text-secondary m-0">
          Scroll down — elements fade in as they enter the viewport.
        </p>
      </div>

      <div className="h-[220px] overflow-y-auto rounded-2xl border border-border bg-white p-4 flex flex-col gap-3">
        {items.map((item, i) => (
          <FadeInBox
            key={item.label}
            label={item.label}
            color={item.color}
            delay={i * 80}
          />
        ))}
      </div>
    </div>
  );
}
