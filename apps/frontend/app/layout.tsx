import { JetBrains_Mono, Outfit } from "next/font/google";
import "../styles/index.css";

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jet-brains-mono",
    display: "swap",
    subsets: ["latin"],
    weight: "700",
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
            <body className={`${outfit.variable} ${jetBrainsMono.variable}`}>{children}</body>
        </html>
    );
}
