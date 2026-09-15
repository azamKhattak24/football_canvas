import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Pitch Tactical Board",
  description: "Plan formations and football tactics on a responsive pitch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
