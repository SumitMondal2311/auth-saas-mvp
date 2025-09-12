import { AuthWrapper } from "@/components/features/auth/auth-wrapper";
import { LoginForm } from "@/components/features/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log in | auth-saas",
};

export default function LoginPage() {
    return (
        <AuthWrapper>
            <h1 className="text-center font-mono text-3xl">Welcome back</h1>
            <LoginForm />
        </AuthWrapper>
    );
}
