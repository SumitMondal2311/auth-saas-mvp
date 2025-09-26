"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { globalStore } from "@/store/global.store";
import { Logs, LucideIcon, Settings2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AuditLogs } from "./settings-dialog-tabs/audit-logs";
import { Preferences } from "./settings-dialog-tabs/preferences";
import { Security } from "./settings-dialog-tabs/security";

type Tab = "Preferences" | "Security" | "Audit Logs";

const tabs: {
    Icon: LucideIcon;
    label: Tab;
}[] = [
    {
        Icon: Settings2,
        label: "Preferences",
    },
    {
        Icon: ShieldCheck,
        label: "Security",
    },
    {
        Icon: Logs,
        label: "Audit Logs",
    },
];

export const SettingsDialog = () => {
    const [tab, setTab] = useState<Tab>("Preferences");
    const { openProfileModel, setOpenProfileModel } = globalStore();

    return (
        <Dialog open={openProfileModel} onOpenChange={setOpenProfileModel}>
            <DialogContent className="!max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="font-mono text-2xl">
                        Manage you account info.
                    </DialogTitle>
                </DialogHeader>
                <div className="h-140 flex flex-1 divide-x rounded-md border">
                    <section className="w-40 space-y-2 p-2">
                        {tabs.map((t, idx) => (
                            <Button
                                onClick={() => setTab(t.label)}
                                key={idx}
                                variant={tab === t.label ? "secondary" : "ghost"}
                                className="w-full cursor-pointer justify-start"
                            >
                                <t.Icon />
                                <span>{t.label}</span>
                            </Button>
                        ))}
                    </section>
                    <section className="flex-1 space-y-4 divide-y p-4">
                        {tab === "Audit Logs" ? (
                            <AuditLogs />
                        ) : tab === "Security" ? (
                            <Security />
                        ) : (
                            <Preferences />
                        )}
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
};
