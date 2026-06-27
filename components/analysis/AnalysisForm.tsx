"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVINCES,
  MAJORS,
  SUBJECTS_3_3,
  SUBJECTS_3_1_2,
  SUBJECTS_WENLI,
} from "@/lib/constants";
import { Loader2, Send } from "lucide-react";

interface AnalysisFormData {
  province: string;
  score: number;
  rank?: number;
  subjects: string;
  batch?: string;
  budget?: string;
  acceptAdjustment?: string;
  major?: string;
  city?: string;
}

interface AnalysisFormProps {
  onSubmit: (data: AnalysisFormData) => void;
  isLoading: boolean;
}

export function AnalysisForm({
  onSubmit,
  isLoading,
}: AnalysisFormProps) {
  const [province, setProvince] = useState("beijing");
  const [score, setScore] = useState(550);
  const [rank, setRank] = useState("");
  const [subjects3_3, setSubjects3_3] = useState<string[]>(["物理", "化学", "生物"]);
  const [firstSubject, setFirstSubject] = useState("物理");
  const [secondSubjects, setSecondSubjects] = useState<string[]>(["化学", "生物"]);
  const [wenliSubject, setWenliSubject] = useState("理科");
  const [batch, setBatch] = useState("本科普通批");
  const [budget, setBudget] = useState("普通公办优先");
  const [acceptAdjustment, setAcceptAdjustment] = useState("可接受");
  const [major, setMajor] = useState("");
  const [city, setCity] = useState("");

  const provinceInfo = PROVINCES.find((p) => p.id === province);
  const examMode = provinceInfo?.examMode || "3+3";

  const subjects =
    examMode === "文理分科"
      ? wenliSubject
      : examMode === "3+1+2"
        ? [firstSubject, ...secondSubjects].join("+")
        : subjects3_3.join("+");
  const subjectValid =
    examMode === "文理分科"
      ? Boolean(wenliSubject)
      : examMode === "3+1+2"
        ? Boolean(firstSubject) && secondSubjects.length === 2
        : subjects3_3.length === 3;

  const toggleSubject = (
    subject: string,
    selected: string[],
    setSelected: (next: string[]) => void,
    max: number
  ) => {
    if (selected.includes(subject)) {
      setSelected(selected.filter((item) => item !== subject));
      return;
    }
    if (selected.length < max) {
      setSelected([...selected, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !subjectValid) return;
    const majorVal = major === "__none__" ? undefined : (major || undefined);
    const rankVal = rank.trim() ? Number(rank) : undefined;
    onSubmit({
      province: provinceInfo?.name || province,
      score,
      rank: Number.isFinite(rankVal) && rankVal && rankVal > 0 ? rankVal : undefined,
      subjects,
      batch,
      budget,
      acceptAdjustment,
      major: majorVal,
      city: city || undefined,
    });
  };

  const renderSubjectButton = (
    subject: string,
    selected: boolean,
    onClick: () => void
  ) => (
    <button
      key={subject}
      type="button"
      onClick={onClick}
      className={`rb-chip-button rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
        selected
          ? "border-sprite/60 bg-sprite/20 text-sprite-bright shadow-[0_0_18px_rgba(31,214,115,0.12)]"
          : "border-white/10 bg-white/[0.04] text-white/55 hover:border-ice/35 hover:text-white"
      }`}
    >
      {subject}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Province */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">省份</Label>
        <Select value={province} onValueChange={(v: string | null) => setProvince(v || "beijing")}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}（{p.examMode}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-white/70 text-sm">高考分数</Label>
          <span className="text-2xl font-extrabold text-xf-yellow">
            {score}
          </span>
        </div>
        <Slider
          value={[score]}
          onValueChange={(v) => setScore(Array.isArray(v) ? v[0] : v)}
          min={100}
          max={750}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>100</span>
          <span>750</span>
        </div>
      </div>

      {/* Score input */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">精确分数</Label>
        <Input
          type="number"
          value={score}
          onChange={(e) => {
            const v = parseInt(e.target.value) || 0;
            setScore(Math.min(750, Math.max(100, v)));
          }}
          min={100}
          max={750}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* Rank */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">
          全省位次 <span className="text-white/30">（建议填）</span>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          placeholder="例如：18500"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          min={1}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
        />
        <p className="text-xs text-white/30">
          去本省教育考试院查一分一段表。没填也能分析，但会降低录取判断确定性。
        </p>
      </div>

      {/* Subjects */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">选科</Label>
        {examMode === "文理分科" && (
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS_WENLI.map((subject) =>
              renderSubjectButton(subject, wenliSubject === subject, () => setWenliSubject(subject))
            )}
          </div>
        )}

        {examMode === "3+3" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUBJECTS_3_3.map((subject) =>
                renderSubjectButton(subject, subjects3_3.includes(subject), () =>
                  toggleSubject(subject, subjects3_3, setSubjects3_3, 3)
                )
              )}
            </div>
            <p className="text-xs text-white/35">
              3+3：从选考科目中选择 3 门，当前已选 {subjects3_3.length}/3。
            </p>
          </div>
        )}

        {examMode === "3+1+2" && (
          <div className="space-y-3">
            <div>
              <div className="mb-2 text-xs font-semibold text-white/45">首选科目（2 选 1）</div>
              <div className="grid grid-cols-2 gap-2">
                {SUBJECTS_3_1_2.first.map((subject) =>
                  renderSubjectButton(subject, firstSubject === subject, () => setFirstSubject(subject))
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-white/45">再选科目（4 选 2）</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SUBJECTS_3_1_2.second.map((subject) =>
                  renderSubjectButton(subject, secondSubjects.includes(subject), () =>
                    toggleSubject(subject, secondSubjects, setSecondSubjects, 2)
                  )
                )}
              </div>
            </div>
            <p className="text-xs text-white/35">
              3+1+2：首选物理/历史，再选 2 门。当前组合：{subjects || "未完整选择"}。
            </p>
          </div>
        )}
        {!subjectValid && (
          <p className="text-xs text-xf-yellow">请按当前省份模式完整选择科目。</p>
        )}
        <p className="text-xs text-white/30">当前省份高考模式：{examMode}</p>
      </div>

      {/* Batch */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">报考批次</Label>
        <Select value={batch} onValueChange={(v: string | null) => setBatch(v || "本科普通批")}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="本科提前批">本科提前批</SelectItem>
            <SelectItem value="本科普通批">本科普通批</SelectItem>
            <SelectItem value="专科提前批">专科提前批</SelectItem>
            <SelectItem value="专科普通批">专科普通批</SelectItem>
            <SelectItem value="艺术/体育类">艺术/体育类</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Constraints */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">预算倾向</Label>
          <Select value={budget} onValueChange={(v: string | null) => setBudget(v || "普通公办优先")}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="普通公办优先">普通公办优先</SelectItem>
              <SelectItem value="可接受民办">可接受民办</SelectItem>
              <SelectItem value="可接受中外合作">可接受中外合作</SelectItem>
              <SelectItem value="预算非常敏感">预算非常敏感</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">服从调剂</Label>
          <Select
            value={acceptAdjustment}
            onValueChange={(v: string | null) => setAcceptAdjustment(v || "可接受")}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="可接受">可接受</SelectItem>
              <SelectItem value="不确定">不确定</SelectItem>
              <SelectItem value="不接受">不接受</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Major (optional) */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">
          目标专业 <span className="text-white/30">（可选）</span>
        </Label>
        <Select value={major} onValueChange={(v: string | null) => setMajor(v || "")}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="暂不选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">暂不选择</SelectItem>
            {MAJORS.map((m) => (
              <SelectItem key={m.id} value={m.name}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City (optional) */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">
          目标城市 <span className="text-white/30">（可选）</span>
        </Label>
        <Input
          placeholder="如：北京、上海、成都..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !subjectValid}
        className="rb-glow-button w-full bg-sprite hover:bg-sprite-bright text-white font-bold py-6 text-base gap-2"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            张老师正在分析...
          </>
        ) : (
          <>
            <Send className="size-5" />
            开始分析
          </>
        )}
      </Button>
    </form>
  );
}
