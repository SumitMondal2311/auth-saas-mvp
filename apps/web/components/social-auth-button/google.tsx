import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export function GoogleAuthButton({ label = "Continue with Google" }: { label?: string }) {
    return (
        <Link
            href="#"
            className={cn(
                buttonVariants({
                    variant: "outline",
                }),
                "flex-1"
            )}
        >
            <Image src="/google.svg" alt="google-icon" height={16} width={16} />
            {label}
        </Link>
    );
}
