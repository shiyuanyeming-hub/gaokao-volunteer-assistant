interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-sprite/30 bg-sprite/10 px-2.5 py-0.5 text-xs font-medium text-sprite-bright"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
