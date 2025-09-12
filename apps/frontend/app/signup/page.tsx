import { AuthWrapper } from "@/components/features/auth/auth-wrapper";
import { SignupForm } from "@/components/features/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up | auth-saas",
};

export default function SignupPage() {
    return (
        <AuthWrapper>
            <h1 className="text-center font-mono text-3xl">Create an account</h1>
            <SignupForm />
        </AuthWrapper>
    );
}
