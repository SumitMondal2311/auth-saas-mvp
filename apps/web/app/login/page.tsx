import { GoogleAuthButton } from "@/components/social-auth-button/google";
import { Separator } from "@radix-ui/react-separator";
import { Metadata } from "next";
import LoginForm from "./form";

export const metadata: Metadata = {
    title: "Log in | auth-saas",
};

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center px-8 md:px-0">
            <div className="mx-auto flex h-max w-80 flex-col gap-8">
                <h1 className="text-center font-mono text-3xl">Welcome back</h1>
                <LoginForm />
                <Separator />
                <GoogleAuthButton />
            </div>
        </div>
    );
}
