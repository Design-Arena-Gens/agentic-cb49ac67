import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "ShortForge | AI Shorts Director",
  description:
    "Design YouTube Shorts instantly. Craft hooks, pacing, visuals, and CTA with an AI agent built for short-form storytelling.",
  openGraph: {
    title: "ShortForge | AI Shorts Director",
    description:
      "Design YouTube Shorts instantly. Craft hooks, pacing, visuals, and CTA with an AI agent built for short-form storytelling.",
    type: "website",
    url: "https://agentic-cb49ac67.vercel.app"
  },
  metadataBase: new URL("https://agentic-cb49ac67.vercel.app")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/2 top-[-10%] h-[420px] w-[420px] rounded-full bg-purple-700/40 blur-[200px]" />
          <div className="absolute right-[-20%] top-[20%] h-[340px] w-[340px] rounded-full bg-fuchsia-500/30 blur-[160px]" />
          <div className="absolute bottom-[-20%] left-[10%] h-[360px] w-[360px] rounded-full bg-sky-500/20 blur-[180px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
