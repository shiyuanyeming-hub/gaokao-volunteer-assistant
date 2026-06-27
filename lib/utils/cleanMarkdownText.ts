/** 清洗 AI 输出中的 Markdown 符号，保留纯文本。 */
export function cleanMarkdownText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/^#{1,3}\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .trim();
}
