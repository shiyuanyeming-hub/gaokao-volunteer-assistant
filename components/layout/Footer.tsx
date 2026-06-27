export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-xf-darker/80 py-4">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-white/40">
        <p>
          本网站基于公开信息与 AI 分析生成内容，仅供参考。志愿填报请以各省教育考试院官方发布为准。
        </p>
        <p className="mt-1">
          人格参考自{" "}
          <a
            href="https://github.com/alchaincyf/zhangxuefeng-skill"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/60"
          >
            zhangxuefeng-skill
          </a>
          （MIT License） · 非官方产品 · 仅供娱乐与参考
        </p>
      </div>
    </footer>
  );
}
