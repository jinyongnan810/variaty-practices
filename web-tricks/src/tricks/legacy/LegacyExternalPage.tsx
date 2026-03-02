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
      className="h-[520px] w-[620px] rounded-2xl border border-border bg-white"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
