import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ToastNotifications from "@/components/ToastNotifications";

export const metadata: Metadata = {
  title: "AgroWave — Smart Farming Platform for India",
  description: "Real-time soil intelligence, predictive weather, live market prices, and smart land management for modern Indian farmers.",
  keywords: ["smart farming","agriculture","India","soil health","crop monitoring","land management"],
  openGraph: {
    title: "AgroWave — Smart Farming Platform",
    description: "Real-time soil intelligence and live market prices for Indian farmers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>"/>
        <meta name="theme-color" content="#059669"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5"/>
      </head>
      <body>
        <Navigation/>
        <main className="min-h-screen">{children}</main>
        <Footer/>
        <ToastNotifications/>
      </body>
    </html>
  );
}
