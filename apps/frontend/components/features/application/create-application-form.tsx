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
import { applicationSchema } from "@/configs/schemas";
import { useCreateApplication } from "@/hooks/use-create-application";
import { applicationStore } from "@/store/application.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideProps, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Schema = z.input<typeof applicationSchema>;

export const CreateApplicationForm = () => {
    const { setUsernameOpt, setPhoneOpt, setGithubOpt } = applicationStore();
    const { mutate, isPending } = useCreateApplication();
    const form = useForm<Schema>({
        resolver: zodResolver(applicationSchema),
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
        setUsernameOpt(!!username);
        setPhoneOpt(!!phone);
        setGithubOpt(!!github);
    }, [username, phone, github, setUsernameOpt, setPhoneOpt, setGithubOpt]);

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
};
