import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Nunito } from "next/font/google";
import "./globals.css";
import { handleGetUser } from "@/lib/server/auth";
import { Providers } from "@/components/layout/Providers";
import { MainLayout } from "@/components/layout/MainLayout";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Talk App", default: "Home | Talk App" },
  icons: { icon: "/talk.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const user = await handleGetUser();

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={nunito.className}>
        <Providers>
          <MainLayout user={user}>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
