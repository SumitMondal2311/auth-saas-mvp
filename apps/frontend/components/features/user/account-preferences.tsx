import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "./user-avatar";

export const AccountPreferences = ({ email }: { email?: string }) => {
    return (
        <>
            <h2 className="text-lg font-medium">Preferences</h2>
            <section className="flex w-full flex-col divide-y">
                <div className="p-2">
                    <UserAvatar className="size-20" />
                </div>
                <div className="flex items-center justify-between p-2">
                    <span>Email address</span>
                    {email ? (
                        <Input disabled value={email} className="w-60" />
                    ) : (
                        <Skeleton className="h-9 w-60" />
                    )}
                </div>
            </section>
        </>
    );
};
