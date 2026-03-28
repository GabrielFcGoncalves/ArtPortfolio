import { Inter, Manrope } from "next/font/google";
import './globals.css';

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
            </head>
            <body className="antialiased font-body bg-surface text-on-background">
                {children}
            </body>
        </html>
    );
}