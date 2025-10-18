"use client";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

NProgress.configure({
  speed: 400,
  minimum: 0.1,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: false,
});

export default function LoadingBar() {
  const pathname = usePathname();
  const { status } = useSession()
  const done = () => NProgress.done();
  const start = () => NProgress.start()

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest("a");
      if (link && link.href && link.href.startsWith(window.location.origin)) start()
      if (link && link.href && link.pathname === pathname) done()
    }

    if (status === 'loading') start()

    // Handle back/forward navigation
    window.addEventListener("popstate", start);

    // Handle normal link clicks
    window.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("popstate", start);
      window.removeEventListener("click", handleLinkClick);
    };
  });

  // Stop progress when new route actually renders
  useEffect(() => {
    if (status !== 'loading') done()
    const timer = setTimeout(() => done(), 300);
    return () => clearTimeout(timer);
  }, [ pathname , status ]);

  return null;
}
