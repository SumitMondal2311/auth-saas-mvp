import { Toaster } from "@/components/ui/sonner";
import { ProfileInfoProvider } from "@/providers/profile-info.provider";
import { QueryProvider } from "@/providers/query.provider";
import { Outfit, Space_Grotesk } from "next/font/google";
import "../styles/index.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    display: "swap",
    subsets: ["latin"],
    weight: "500",
});

const outfit = Outfit({
    variable: "--font-outfit",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.variable} ${spaceGrotesk.variable}`}>
                <QueryProvider>
                    <ProfileInfoProvider>{children}</ProfileInfoProvider>
                </QueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
