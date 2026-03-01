export default function Glassmorphism() {
  return (
    <div className="relative w-[480px] h-[320px] rounded-2xl overflow-hidden">
      {/* Colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300" />
      <div className="absolute top-8 left-12 w-32 h-32 bg-blue-400 rounded-full opacity-60 blur-sm" />
      <div className="absolute bottom-12 right-16 w-24 h-24 bg-yellow-300 rounded-full opacity-60 blur-sm" />

      {/* Glass card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] p-6 rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-lg">
        <h3 className="text-white text-lg font-display font-bold m-0 mb-2">
          Glass Card
        </h3>
        <p className="text-white/80 text-sm leading-relaxed m-0">
          This card uses <code className="bg-white/20 px-1 rounded text-xs">backdrop-filter: blur()</code> and a semi-transparent background to create a frosted glass effect.
        </p>
      </div>
    </div>
  );
}
