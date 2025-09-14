"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailVerificationSchema } from "@/configs/schemas";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Schema = z.infer<typeof emailVerificationSchema>;

export function EmailVerificationForm() {
    const { mutate, isPending } = useVerifyEmail.POST();

    const form = useForm<Schema>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
            code: "",
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
