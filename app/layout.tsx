import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata: Metadata = {
  title: "Weats",
  description: "Your personal food recommendation app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthInitializer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
