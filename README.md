# 雪碧志愿填报助手

一个张老师风格的高考志愿互动工具：聊天、志愿分析、挑战模式三合一。

## 在线访问

[国内优先：EdgeOne 访问](https://gaokao-volunteer-assistant.edgeone.dev/)

[海外备用：Vercel 访问](https://gaokao-volunteer-assistant-coral.vercel.app/)

如果只是想让别人看到网站，直接把 EdgeOne 链接发给对方就可以。GitHub 仓库负责展示代码，EdgeOne / Vercel 链接才是可直接打开使用的网站。

## 在线能力

- 聊天模式：直播间连麦式问答，支持不同人格语气。
- 志愿分析：输入省份、分数、位次、选科、批次、预算、调剂意愿、目标专业/城市，生成情况分析、风险判断、志愿建议和锐评。
- 挑战模式：挑战不被张老师嘲笑，但选什么都会被笑，娱乐化理解志愿决策风险。
- API 设置：前端可填写 DeepSeek / OpenAI / Qwen / Gemini / 自定义兼容 API，Key 只保存在当前浏览器。

## 信息来源

人格和表达层参考：

- [alchaincyf/zhangxuefeng-skill](https://github.com/alchaincyf/zhangxuefeng-skill)（MIT License）
- [a18515373115-droid/ZhangXueFeng-skill](https://github.com/a18515373115-droid/ZhangXueFeng-skill)：2.0 版现实咨询协议、官方数据边界、情绪安全边界和普通家庭策略参考。

2026 报考信息依据层参考：

- [阳光高考信息平台](https://gaokao.chsi.com.cn/)
- [2026 年高考网上咨询周](https://gaokao.chsi.com.cn/zxdy/)：6 月 22 日至 28 日开放文字问答和视频直播咨询。
- [阳光志愿信息服务系统](https://gaokao.chsi.com.cn/zyck/)：2026 年支持 31 省本专科普通批次志愿筛选。
- [教育部官网](https://www.moe.gov.cn/)
- [各省招生政策入口](https://gaokao.chsi.com.cn/gkxx/zc/ss/)

应用会在 prompt 中提醒模型优先核对：省份、科类/选科、位次或一分一段、批次线、招生计划、招生章程、专业选科要求、体检/语种/单科限制、调剂规则、转专业规则和学费。

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址，通常是 `http://localhost:3000`。

## API 配置

可以用两种方式：

1. 在页面右上角 `API` 按钮里填写并保存到当前浏览器。
2. 在部署环境变量里配置：

```env
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your-key
DEEPSEEK_MODEL=deepseek-chat
```

也支持：

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
QWEN_API_KEY=
QWEN_MODEL=qwen-plus
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
```

### API 排查

- DeepSeek：默认模型 `deepseek-chat`，Base URL 使用 `https://api.deepseek.com/v1`。
- Qwen：默认模型 `qwen-plus`，Base URL 使用 `https://dashscope.aliyuncs.com/compatible-mode/v1`。
- Qwen 的 Key 必须是 DashScope / 阿里云百炼「模型服务」API Key，不是阿里云 RAM 的 AccessKey ID / Secret。
- 页面右上角 `API` 里的「测试连接」会同时测试普通请求和流式聊天；如果测试成功，聊天也应该能正常出字。
- 如果复制了 `Bearer sk-...` 或完整接口地址 `/chat/completions`，应用会自动清理成可用格式。

## 公开分享与隐藏 API Key

如果要把网站发给别人直接用，不要让用户自己填 Key，也不要把 Key 写进代码或提交到 GitHub。正确做法是：

1. 在部署平台的 Environment Variables / Secrets 里配置服务端 Key。
2. 前端只请求本项目的 `/api/chat`、`/api/analysis` 等后端接口。
3. 后端读取环境变量调用 DeepSeek / OpenAI / Qwen / Gemini。
4. 浏览器永远拿不到真实 API Key。

推荐部署变量：

```env
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your-server-side-key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
ALLOW_CLIENT_API_OVERRIDE=false
PUBLIC_REQUESTS_PER_HOUR=60
```

变量名必须完整填写成上面这种形式。不要只建一个叫 `deepseek`、`qwen` 或 `api_key` 的变量，代码不会读取这些名字。

当服务端 Key 已配置时，页面右上角会显示「云端 API」，不会再暴露 API 设置入口。`PUBLIC_REQUESTS_PER_HOUR` 是轻量限流，防止公开链接被刷爆额度。

如果在 Vercel 修改了 Environment Variables，需要重新部署一次 Production，线上网站才会读到新 Key。

## 安全边界

本项目是娱乐化和辅助型工具，不冒充张雪峰本人，不承诺录取，不替代官方志愿填报系统。所有结果必须以各省教育考试院、阳光高考平台和目标高校招生章程为准。
