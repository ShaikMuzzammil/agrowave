"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* The standalone /contact page has been merged into the home page as a
   section (Home → #contact). This route now simply redirects there so
   old links/bookmarks keep working. */
export default function ContactRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#contact-section");
  }, [router]);
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{background:"#0a1a0e"}}>
      <p className="text-green-300 text-sm font-semibold animate-pulse">Redirecting to Home → Contact…</p>
    </div>
  );
}
