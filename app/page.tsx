"use client";

import Link from "next/link";
import { MessageCircle, BarChart3, Swords, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XuefengAvatar } from "@/components/shared/XuefengAvatar";
import { CurrentInfoPanel } from "@/components/shared/CurrentInfoPanel";
import { motion } from "framer-motion";

const modes = [
  {
    href: "/chat",
    icon: MessageCircle,
    title: "聊天模式",
    desc: "来找张老师聊聊高考、志愿、专业、就业。三种人格模式可选——他会反问、会举例、会拆幻想，最后一定给你实在建议。",
    color: "bg-sprite",
    active: true,
  },
  {
    href: "/analysis",
    icon: BarChart3,
    title: "志愿分析",
    desc: "省份、分数、选科、目标——填好之后张老师给你做志愿分析。情况分析→风险评估→志愿建议→锐评，一步到位。",
    color: "bg-ice",
    active: true,
  },
  {
    href: "/challenge",
    icon: Swords,
    title: "攻略雪车头",
    desc: "10关闯关！分数低直接笑，专科笑，文科生笑，艺术生美术生也笑。选什么都被嘲笑，但每次嘲笑都带一点真实志愿提醒。",
    color: "bg-choco",
    active: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 25 },
  },
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center px-4 py-16 text-center"
      >
        <XuefengAvatar mood="normal" size="lg" className="mb-6" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          <span className="text-white">雪碧</span>
          <span className="text-sprite-bright">志愿填报</span>
          <span className="text-white">助手</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-lg mb-2">
          一个真正懂张老师的 AI 志愿助手
        </p>
        <p className="text-sm text-xf-yellow font-medium mb-8">
          不是套了个皮肤的普通 AI —— 它会反问、会拆你的幻想，最后一定给你出路
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/chat">
            <Button
              size="lg"
              className="rb-glow-button bg-sprite hover:bg-sprite-bright text-white font-bold px-8 gap-2 text-base"
            >
              <MessageCircle className="size-5" />
              进入直播间
            </Button>
          </Link>
          <Link href="/analysis">
            <Button
              size="lg"
              variant="outline"
              className="rb-outline-button border-ice/60 text-ice-bright hover:bg-ice/10 font-bold px-8 gap-2 text-base"
            >
              <BarChart3 className="size-5" />
              志愿分析
            </Button>
          </Link>
          <Link href="/challenge">
            <Button
              size="lg"
              variant="outline"
              className="rb-outline-button border-sprite/60 text-sprite-bright hover:bg-sprite/10 font-bold px-8 gap-2 text-base"
            >
              <Swords className="size-5" />
              攻略雪车头
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Mode Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-5xl px-4 pb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {modes.map((mode) => (
          <motion.div key={mode.href} variants={itemVariants}>
            <Link href={mode.active ? mode.href : "#"} className="block h-full group">
              <Card className="h-full bg-xf-card border-white/10 hover:border-sprite/50 transition-all duration-300 group-hover:-translate-y-1">
                <CardHeader>
                  <div
                    className={`inline-flex size-12 items-center justify-center rounded-xl ${mode.color} mb-3`}
                  >
                    <mode.icon className="size-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-lg">{mode.title}</CardTitle>
                    {!mode.active && (
                      <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded">
                        即将开放
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/50 leading-relaxed">{mode.desc}</p>
                  <div className="rb-link-button mt-4 flex w-fit items-center gap-1 text-sm text-xf-red-bright font-medium group-hover:gap-2 transition-all">
                    进入模式 <ArrowRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <CurrentInfoPanel compact />
      </section>
    </div>
  );
}
