interface LegacyExternalPageProps {
  title: string;
  src: string;
}

export default function LegacyExternalPage({
  title,
  src,
}: LegacyExternalPageProps) {
  return (
    <iframe
      title={title}
      src={src}
      className="h-full w-full rounded-2xl border border-border bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
