"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authenticationSchema } from "@/configs/schemas";
import { useSignup } from "@/hooks/use-signup";
import { cn } from "@/lib/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Schema = z.infer<typeof authenticationSchema>;

export function SignupForm() {
    const { mutate, isPending } = useSignup();

    const form = useForm<Schema>({
        resolver: zodResolver(authenticationSchema),
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
                    <p className="text-sm">Already have an account?</p>
                    <Link
                        href="/login"
                        className={cn(
                            buttonVariants({
                                variant: "link",
                            }),
                            "text-blue-600"
                        )}
                    >
                        Log in
                    </Link>
                </div>
            </form>
        </Form>
    );
}
