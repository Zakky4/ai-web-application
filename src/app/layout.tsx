import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "AI Writing Tools",
  description: "AI-powered blog, email, and summarization tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="h-full">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-noto-sans-jp)",
              fontSize: "13px",
              borderRadius: "6px",
              boxShadow: "0 1px 8px 0 rgba(0,0,0,0.08)",
            },
            error: {
              style: {
                background: "#fff",
                border: "1px solid #fecaca",
                color: "#dc2626",
              },
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
