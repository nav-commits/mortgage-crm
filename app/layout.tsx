import { Inter } from "next/font/google";
import Provider from "./provider";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
