"use client";

import { EmailVerificationForm } from "@/components/features/auth/email-verification-form";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { useEffect, useState } from "react";
import Error from "../error";
import LoadingPage from "../loading";

export default function EmailVerificationPage() {
    const [initialized, setInitialized] = useState(false);
    const [email, setEmail] = useState("");
    const { mutate, isPending, isError, error, isSuccess, data } = useVerifyEmail.GET();

    useEffect(() => {
        mutate(undefined);
        setInitialized(true);
    }, [mutate]);

    useEffect(() => {
        if (isSuccess) {
            setEmail(data.data.email);
        }
    }, [isSuccess, data]);

    if (isPending || !initialized) {
        return <LoadingPage />;
    }

    return (
        <>
            {isError ? (
                <Error error={error} />
            ) : (
                <div className="flex h-screen items-center justify-center">
                    <div className="flex w-80 flex-col gap-8">
                        <div className="text-center">
                            <h1 className="font-mono text-2xl font-bold">Check your inbox</h1>
                            <p>Enter the verification code we just sent to {email}</p>
                        </div>
                        <EmailVerificationForm />
                    </div>
                </div>
            )}
        </>
    );
}
