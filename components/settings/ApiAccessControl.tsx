"use client";

import { useEffect, useState } from "react";
import { Cloud, ShieldCheck } from "lucide-react";
import { ApiSettingsDialog } from "@/components/settings/ApiSettingsDialog";

interface PublicConfig {
  serverApiReady: boolean;
  providerLabel: string;
  clientOverrideAllowed: boolean;
}

export function ApiAccessControl() {
  const [config, setConfig] = useState<PublicConfig | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/public-config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (alive) setConfig(data);
      })
      .catch(() => {
        if (alive) {
          setConfig({
            serverApiReady: false,
            providerLabel: "",
            clientOverrideAllowed: true,
          });
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  if (!config) {
    return null;
  }

  if (config.serverApiReady && !config.clientOverrideAllowed) {
    return (
      <div className="hidden items-center gap-1.5 rounded-full border border-sprite/25 bg-sprite/10 px-3 py-1.5 text-xs font-bold text-sprite-bright sm:flex">
        <Cloud className="size-3.5" />
        云端 API
        <ShieldCheck className="size-3.5 text-ice-bright" />
      </div>
    );
  }

  return <ApiSettingsDialog />;
}
