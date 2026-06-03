import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AgroWave – Smart Farming Platform",
  description: "TerraForge AI: Real-time farm intelligence with 6-plot monitoring, weather, market, inventory and land analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
