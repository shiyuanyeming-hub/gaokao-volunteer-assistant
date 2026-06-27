export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <span className="text-sm text-white/50">张老师正在输入</span>
      <span className="flex gap-0.5">
        <span className="size-1.5 rounded-full bg-xf-red animate-bounce [animation-delay:0ms]" />
        <span className="size-1.5 rounded-full bg-xf-red animate-bounce [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-xf-red animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  );
}
