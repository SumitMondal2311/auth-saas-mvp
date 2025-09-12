"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authenticationSchema } from "@/configs/schemas";
import { useLogin } from "@/hooks/use-login";
import { cn } from "@/lib/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Schema = z.infer<typeof authenticationSchema>;

export function LoginForm() {
    const { mutate, isPending } = useLogin();

    const form = useForm<Schema>({
        resolver: zodResolver(authenticationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
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
                                <Input {...field} type="password" placeholder="Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="flex cursor-pointer gap-2">
                    Continue
                </Button>
                <div className="flex items-center self-center text-sm">
                    <p>Don't have an account?</p>
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
