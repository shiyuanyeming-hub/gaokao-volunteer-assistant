"use client";

import { useMemo, useState } from "react";
import { KeyRound, Save, Trash2, Loader2, PlugZap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  API_PROVIDER_OPTIONS,
  clearStoredApiSettings,
  getProviderDefaults,
  loadStoredApiSettings,
  maskApiKey,
  normalizeApiSettings,
  saveStoredApiSettings,
  type ApiProvider,
  type ClientApiSettings,
} from "@/lib/api-settings";

const emptySettings = normalizeApiSettings(null);

export function ApiSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ClientApiSettings>(emptySettings);
  const [savedKey, setSavedKey] = useState("");
  const [testing, setTesting] = useState(false);

  const providerMeta = useMemo(
    () => getProviderDefaults(settings.provider),
    [settings.provider]
  );
  const modelOptions = useMemo(() => {
    if (!settings.model || providerMeta.models.includes(settings.model)) {
      return providerMeta.models;
    }
    return [settings.model, ...providerMeta.models];
  }, [providerMeta.models, settings.model]);

  const updateProvider = (provider: ApiProvider) => {
    const defaults = getProviderDefaults(provider);
    setSettings((current) => ({
      ...current,
      provider,
      model: defaults.model,
      baseURL: defaults.baseURL,
    }));
  };

  const handleOpen = () => {
    const stored = loadStoredApiSettings();
    if (stored) {
      setSettings(stored);
      setSavedKey(stored.apiKey);
    }
    setOpen(true);
  };

  const handleSave = () => {
    const normalized = normalizeApiSettings(settings);
    if (!normalized.apiKey) {
      toast.error("先填 API Key，不然张老师只能干瞪眼。 ");
      return;
    }
    if (normalized.provider === "custom" && !normalized.baseURL) {
      toast.error("自定义 API 需要填写 Base URL。 ");
      return;
    }
    saveStoredApiSettings(normalized);
    setSettings(normalized);
    setSavedKey(normalized.apiKey);
    toast.success("API 设置已保存在本机浏览器。 ");
    setOpen(false);
  };

  const handleClear = () => {
    clearStoredApiSettings();
    setSettings(emptySettings);
    setSavedKey("");
    toast.success("已清除本机 API 设置。 ");
  };

  // 用对话框里当前填的配置发一个极小请求，验证 key/provider/baseURL 是否可用
  const handleTest = async () => {
    const normalized = normalizeApiSettings(settings);
    if (!normalized.apiKey) {
      toast.error("先填 API Key 再测试。 ");
      return;
    }
    if (normalized.provider === "custom" && !normalized.baseURL) {
      toast.error("自定义 API 需要填写 Base URL。 ");
      return;
    }
    setTesting(true);
    try {
      const res = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiConfig: normalized }),
      });
      const data = await res.json();
      if (data.ok) {
        saveStoredApiSettings(normalized);
        setSettings(normalized);
        setSavedKey(normalized.apiKey);
        toast.success(`连接成功，已保存（${normalized.provider} · ${normalized.model}）`);
      } else {
        toast.error(`连接失败：${data.error}`);
      }
    } catch {
      toast.error("测试请求失败，请检查网络。 ");
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="gap-1.5 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <KeyRound className="size-4" />
        <span className="hidden sm:inline">API</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-white/10 bg-xf-card p-0 text-white shadow-2xl shadow-black/40">
          <DialogHeader className="border-b border-white/10 px-5 pt-5 pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg font-extrabold text-white">
              <KeyRound className="size-5 text-sprite-bright" /> API 设置
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-white/45">
              Key 只保存在当前浏览器 localStorage，请求时随聊天/分析发送到本项目后端使用；不要在公共电脑保存。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-4">
            <div className="rounded-xl border border-sprite/20 bg-sprite/5 px-3 py-2 text-xs text-white/60">
              当前状态：{maskApiKey(savedKey)}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60">服务商</Label>
              <Select
                value={settings.provider}
                onValueChange={(value: string | null) =>
                  updateProvider((value || "deepseek") as ApiProvider)
                }
              >
                <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {API_PROVIDER_OPTIONS.map((item) => (
                    <SelectItem key={item.provider} value={item.provider}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/35">{providerMeta.note}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60">API Key</Label>
              <Input
                type="password"
                value={settings.apiKey}
                placeholder={
                  settings.provider === "qwen"
                    ? "DashScope / 百炼模型服务 API Key"
                    : "sk-... / 不要填 GitHub token"
                }
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    apiKey: event.target.value,
                  }))
                }
                className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
              />
            </div>

            {settings.provider === "qwen" && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-100/80">
                千问这里要填 DashScope / 百炼控制台里的「模型服务 API Key」。如果填的是阿里云
                AccessKey ID 或 Secret，平台会返回 invalid_api_key。
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs text-white/60">模型</Label>
                {settings.provider === "custom" ? (
                  <Input
                    value={settings.model}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        model: event.target.value,
                      }))
                    }
                    className="border-white/10 bg-white/5 text-white"
                  />
                ) : (
                  <Select
                    value={settings.model}
                    onValueChange={(value: string | null) =>
                      setSettings((current) => ({
                        ...current,
                        model: value || providerMeta.model,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modelOptions.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Base URL</Label>
                <Input
                  value={settings.baseURL || ""}
                  placeholder={settings.provider === "openai" || settings.provider === "gemini" ? "默认即可" : "https://.../v1"}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      baseURL: event.target.value,
                    }))
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/25"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-white/10 bg-xf-darker/70 px-5 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="gap-1.5 text-white/55 hover:bg-white/10 hover:text-white"
            >
              <Trash2 className="size-4" /> 清除
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTest}
              disabled={testing}
              className="gap-1.5 border-white/15 bg-transparent text-white/80 hover:bg-white/10"
            >
              {testing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <PlugZap className="size-4" />
              )}
              {testing ? "测试中..." : "测试连接"}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="gap-1.5 bg-sprite font-bold text-white hover:bg-sprite-bright"
            >
              <Save className="size-4" /> 保存 API 设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
