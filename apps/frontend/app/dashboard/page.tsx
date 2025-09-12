"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/cn";
import { userStore } from "@/store/user.store";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

export default function DashboardPage() {
    const [initialized, setInitialized] = useState(false);
    const { user } = userStore();
    const { mutate } = useLogout();

    useEffect(() => {
        setInitialized(true);
    }, []);

    if (!initialized) {
        return <LoadingPage />;
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Button
                onClick={() => mutate(undefined)}
                className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "absolute right-8 top-8 cursor-pointer"
                )}
            >
                <LogOut /> Logout
            </Button>
            Welcome, {user?.emailAddress.email.split("@")[0]}
        </div>
    );
}
