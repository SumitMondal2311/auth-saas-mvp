import { CreateApplicationForm } from "@/components/features/application/create-application-form";
import { CreateApplicationPreview } from "@/components/features/application/create-application-preview";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateApplicationPage() {
    return (
        <div className="flex h-screen md:divide-x">
            <section className="flex w-full items-center px-4 md:w-1/2">
                <div className="relative mx-auto flex h-[500px] w-96 flex-col p-2 md:border">
                    <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground absolute -top-8 flex cursor-pointer items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Dashboard</span>
                    </Link>
                    <h1 className="p-2 font-mono text-lg">Let's build your &lt;LogIn /&gt;</h1>
                    <CreateApplicationForm />
                </div>
            </section>
            <section className="hidden w-1/2 items-center px-4 md:flex">
                <CreateApplicationPreview />
            </section>
        </div>
    );
}
