"use client";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

NProgress.configure({
  speed: 500,
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

    window.addEventListener("load", start);
    window.addEventListener("popstate", start);
    window.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("load", start);
      window.removeEventListener("popstate", start);
      window.removeEventListener("click", handleLinkClick);
    };
  });

  // Stop progress when new route actually renders
  useEffect(() => {
    if (status === 'loading') start()
    const timer = setTimeout(() => {if (status !== 'loading') done()}, 300);
    return () => clearTimeout(timer);
  }, [ pathname , status ]);

  return null;
}
