"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailVerificationSchema } from "@/configs/schemas";
import { apiClient } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api-error-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Schema = z.infer<typeof emailVerificationSchema>;

const api = async (data: Schema) => {
    return await apiClient.post<{
        message: string;
    }>("/api/auth/verify-email", data);
};

export default function EmailVerificationForm() {
    const router = useRouter();
    const { mutate, isPending } = useMutation<
        Awaited<ReturnType<typeof api>>,
        AxiosError<ApiErrorResponse>,
        {
            code: string;
        }
    >({
        mutationFn: api,
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                throw error;
            }
        },
        onSuccess: (response) => {
            const { message } = response.data;
            toast.success(message || "Email verified successfully");
            router.push("/dashboard");
        },
    });

    const form = useForm<Schema>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
            code: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: Schema) => {
        mutate(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    void form.handleSubmit(onSubmit)(e);
                }}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    maxLength={6}
                                    placeholder="Code"
                                    onChange={(e) =>
                                        field.onChange(e.target.value.replace(/\D/g, ""))
                                    }
                                    className={field.value ? "tracking-widest" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="cursor-pointer">
                    Continue
                </Button>
            </form>
        </Form>
    );
}
