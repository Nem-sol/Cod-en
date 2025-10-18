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

  useEffect(() => {
    const done = () => NProgress.done();
    const start = () => NProgress.start();

    const handleLinkClick = (e) => {
      const link = e.target.closest("a");
      if (link && link.href && link.href.startsWith(window.location.origin)) start()
      if (link && link.href && link.pathname === pathname) done()
    }

    // Handle back/forward navigation
    window.addEventListener("popstate", start);

    // Handle full page reload (F5 / Ctrl+R)
    window.addEventListener("load", start);

    // Handle normal link clicks
    window.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("load", start);
      window.removeEventListener("popstate", start);
      window.removeEventListener("click", handleLinkClick);
    };
  });

  // Stop progress when new route actually renders
  useEffect(() => {
    if (status !== 'loading') NProgress.done()
    const timer = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timer);
  }, [ pathname , status ]);

  return null;
}
