import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prognoza pogody ? Przedwoj?w i inne",
  description: "Szybka prognoza pogody dla dowolnego miejsca w Polsce.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
