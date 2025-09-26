import { SettingsDialog } from "@/components/profile/dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import Applications from "./applications";
import { ProfileMenuTrigger } from "./profile-menu-trigger";

export default function DashboardPage() {
    return (
        <div className="flex h-screen flex-col divide-y">
            <section className="flex items-center justify-between px-4 py-3">
                <h1 className="font-mono">auth/saas</h1>
                <ProfileMenuTrigger />
            </section>
            <SettingsDialog />
            <section className="grid grid-cols-1 gap-4 overflow-scroll p-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                <Link
                    href="/application/create"
                    className="bg-accent text-muted-foreground hover:text-foreground flex h-60 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed transition-colors"
                >
                    <Plus size={20} />
                    <span>Create application</span>
                </Link>
                <Applications />
            </section>
        </div>
    );
}
