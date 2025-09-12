import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/providers/query.provider";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/index.css";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    display: "swap",
    subsets: ["latin"],
    weight: "500",
});

const inter = Inter({
    variable: "--font-inter",
    display: "swap",
    subsets: ["latin"],
    weight: "300",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
                <QueryProvider>{children}</QueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
