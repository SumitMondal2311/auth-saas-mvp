import { GoogleAuthButton } from "@/components/features/auth/google-auth-button";
import { Separator } from "@/components/ui/separator";
import React from "react";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen items-center px-8 md:px-0">
            <div className="mx-auto flex h-max w-80 flex-col gap-8">
                {children}
                <Separator />
                <GoogleAuthButton />
            </div>
        </div>
    );
};
