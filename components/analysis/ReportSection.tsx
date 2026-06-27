import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, Lightbulb, Zap } from "lucide-react";

const sectionIcons: Record<string, React.ReactNode> = {
  analysis: <TrendingUp className="size-5 text-blue-400" />,
  risks: <AlertTriangle className="size-5 text-yellow-400" />,
  suggestions: <Lightbulb className="size-5 text-green-400" />,
  roast: <Zap className="size-5 text-xf-red-bright" />,
};

const sectionColors: Record<string, string> = {
  analysis: "border-l-blue-500",
  risks: "border-l-yellow-500",
  suggestions: "border-l-green-500",
  roast: "border-l-xf-red",
};

interface ReportSectionProps {
  type: "analysis" | "risks" | "suggestions" | "roast";
  title: string;
  content: string;
  isStreaming?: boolean;
}

export function ReportSection({
  type,
  title,
  content,
  isStreaming,
}: ReportSectionProps) {
  return (
    <Card
      className={cn(
        "border-l-4 bg-xf-card border-white/10",
        sectionColors[type]
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          {sectionIcons[type]}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-xf-red-bright animate-pulse rounded-sm align-middle" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
