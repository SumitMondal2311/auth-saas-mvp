"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createApplicationSchema } from "@/configs/schemas";
import { apiClient } from "@/lib/axios";
import { applicationStore } from "@/store/application.store";
import { ApiErrorResponse } from "@/types/api-error-response";
import { Application } from "@/types/application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LucideProps, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Schema = z.input<typeof createApplicationSchema>;

const api = async (data: Schema) => {
    return await apiClient.post<{
        message: string;
        application: Application;
    }>("/api/application/create", data);
};

export default function CreateApplicationForm() {
    const router = useRouter();

    const { mutate, isPending } = useMutation<
        Awaited<ReturnType<typeof api>>,
        AxiosError<ApiErrorResponse>,
        {
            name: string;
            username: boolean;
            phone: boolean;
            github: boolean;
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
            const { application, message } = response.data;
            applicationStore.setState((state) => ({
                applications: [application, ...state.applications],
            }));
            toast.success(message || "Created application successfully");
            router.push("/dashboard");
        },
    });

    const form = useForm<Schema>({
        resolver: zodResolver(createApplicationSchema),
        defaultValues: {
            name: "",
            username: false,
            phone: false,
            github: false,
        },
        mode: "onTouched",
    });

    const { username, phone, github } = form.watch();
    useEffect(() => {
        applicationStore.setState({
            username,
            phone,
            github,
        });
    }, [username, phone, github]);

    const onSubmit = (data: Schema) => {
        mutate(data);
    };

    const options: {
        name: keyof Schema;
        Icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        label: string;
    }[] = [
        {
            name: "username",
            Icon: User,
            label: "Username",
        },
        {
            name: "phone",
            Icon: Phone,
            label: "Phone",
        },
    ];

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    void form.handleSubmit(onSubmit)(e);
                }}
                className="flex flex-1 flex-col justify-between gap-4"
            >
                <div className="bg-accent rounded-md border">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="p-2">
                                <FormLabel>Application name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="My application"
                                        className="bg-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="p-2">
                        <h2 className="font-medium">Log in options</h2>
                        <p className="text-muted-foreground text-sm">
                            You can change these anytime in your dashboard.
                        </p>
                    </div>
                    <section className="max-h-52 space-y-2 divide-y overflow-scroll">
                        <div className="flex items-center justify-between p-2">
                            <Label className="flex items-center">
                                <Mail size={16} />
                                <span>Email</span>
                            </Label>
                            <Switch checked className="cursor-not-allowed" />
                        </div>
                        {options.map((opt, idx) => (
                            <FormField
                                key={idx}
                                control={form.control}
                                name={opt.name}
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between p-2">
                                        <FormLabel className="flex items-center">
                                            <opt.Icon size={16} />
                                            <span
                                                className={
                                                    field.value ? "" : "text-muted-foreground"
                                                }
                                            >
                                                {opt.label}
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={!!field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}
                        <div className="flex items-center justify-between p-2">
                            <Label className="flex items-center">
                                <Image src="/google.svg" alt="google-icon" width={16} height={16} />
                                <span>Google</span>
                            </Label>
                            <Switch checked className="cursor-not-allowed" />
                        </div>
                        <FormField
                            control={form.control}
                            name="github"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-2">
                                    <FormLabel className="flex items-center">
                                        <Image
                                            src="/github.svg"
                                            alt="github-logo"
                                            width={16}
                                            height={16}
                                        />
                                        <span
                                            className={field.value ? "" : "text-muted-foreground"}
                                        >
                                            GitHub
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </section>
                </div>
                <Button type="submit" disabled={isPending} className="cursor-pointer">
                    Create application
                </Button>
            </form>
        </Form>
    );
}
