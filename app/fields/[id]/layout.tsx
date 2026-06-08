import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Parcel Detail — AgroWave",
};

export default function FieldDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:"DM Sans,system-ui,sans-serif"}}>
        {children}
      </body>
    </html>
  );
}
