"use client";

import { GitHubAuthButton } from "@/components/features/auth/github-auth-button";
import { GoogleAuthButton } from "@/components/features/auth/google-auth-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applicationStore } from "@/store/application.store";
import { Separator } from "@radix-ui/react-separator";

export const CreateApplicationPreview = () => {
    const { username, phone, github } = applicationStore();

    return (
        <div className="pointer-events-none relative mx-auto flex h-[500px] w-96 select-none flex-col justify-center gap-8 border">
            <Badge variant="outline" className="absolute left-2 top-2">
                Preview
            </Badge>
            <h1 className="text-center font-mono text-2xl">Welcome back</h1>
            <div className="mx-auto flex w-full flex-col gap-4 px-8">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label id="email" className="flex items-center justify-between">
                            <span>{username ? "Email or username" : "Email"}</span>
                            {phone ? <span className="underline">Use phone</span> : null}
                        </Label>
                        <Input id="email" />
                    </div>
                    <div className="space-y-2">
                        <Label id="password">Password</Label>
                        <Input id="password" />
                    </div>
                    <Button>Continue</Button>
                    <div className="flex items-center self-center">
                        <p className="text-sm">Don't have an account?</p>
                        <Button variant="link" className="text-blue-600">
                            sign up
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                    <GoogleAuthButton label={github ? "Google" : undefined} />
                    {github ? <GitHubAuthButton label="GitHub" /> : null}
                </div>
            </div>
        </div>
    );
};
