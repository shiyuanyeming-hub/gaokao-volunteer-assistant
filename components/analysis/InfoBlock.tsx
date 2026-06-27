interface InfoBlockProps {
  title: string;
  content: string;
}

export function InfoBlock({ title, content }: InfoBlockProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <h4 className="mb-1 text-xs font-bold text-white/70">{title}</h4>
      <p className="text-sm leading-relaxed text-white/80">{content}</p>
    </div>
  );
}
