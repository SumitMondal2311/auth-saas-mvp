import { GoogleAuthButton } from "@/components/social-auth-button/google";
import { Separator } from "@radix-ui/react-separator";
import { Metadata } from "next";
import SignupForm from "./form";

export const metadata: Metadata = {
    title: "Sign up | auth-saas",
};

export default function SignupPage() {
    return (
        <div className="flex h-screen items-center px-8 md:px-0">
            <div className="mx-auto flex h-max w-80 flex-col gap-8">
                <h1 className="text-center font-mono text-3xl">Create an account</h1>
                <SignupForm />
                <Separator />
                <GoogleAuthButton />
            </div>
        </div>
    );
}
