"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authSchema } from "@/configs/schemas";
import { apiClient } from "@/lib/axios";
import { ApiErrorResponse } from "@/types/api-error-response";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Schema = z.infer<typeof authSchema>;

const api = async (data: Schema) => {
    return await apiClient.post<{
        message: string;
    }>("/api/auth/login", data);
};

export default function LoginForm() {
    const router = useRouter();
    const { mutate, isPending } = useMutation<
        Awaited<ReturnType<typeof api>>,
        AxiosError<ApiErrorResponse>,
        Schema
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
            toast.success(message || "Logged in successfully");
            router.push("/dashboard");
        },
    });

    const form = useForm<Schema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field} type="email" placeholder="Email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    placeholder="Password"
                                    className={field.value ? "font-extrabold tracking-widest" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="cursor-pointer">
                    Continue
                </Button>
                <div className="flex items-center self-center">
                    <p className="text-sm">Don't have an account?</p>
                    <Link
                        href="/signup"
                        className={cn(
                            buttonVariants({
                                variant: "link",
                            }),
                            "text-blue-600"
                        )}
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    );
}
