"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { globalStore } from "@/store/global.store";
import { userStore } from "@/store/user.store";
import { Logs, LucideProps, Settings2, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { AccountAuditLogs } from "./account-audit-logs";
import { AccountPreferences } from "./account-preferences";
import { AccountSecurity } from "./account-security";

type Item = "Preferences" | "Security" | "Audit Logs";

const items: {
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    label: Item;
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

export const ManageAccountModal = () => {
    const [content, setContent] = useState<Item>("Preferences");
    const { openProfileModel, setOpenProfileModel } = globalStore();
    const { primaryEmail } = userStore();

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
                        {items.map((item, idx) => (
                            <Button
                                onClick={() => setContent(item.label)}
                                key={idx}
                                variant={content === item.label ? "secondary" : "ghost"}
                                className="w-full cursor-pointer justify-start"
                            >
                                <item.Icon />
                                <span>{item.label}</span>
                            </Button>
                        ))}
                    </section>
                    <section className="flex-1 space-y-4 divide-y p-4">
                        {content === "Preferences" ? (
                            <AccountPreferences email={primaryEmail} />
                        ) : null}
                        {content === "Security" ? <AccountSecurity /> : null}
                        {content === "Audit Logs" ? <AccountAuditLogs /> : null}
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
};
