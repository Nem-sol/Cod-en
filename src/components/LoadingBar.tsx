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
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest("a");
      if (link && link.href && link.href.startsWith(window.location.origin)) start()
      if (link && link.href && link.pathname === pathname) done()
    }

    if (status === 'loading') start()
    
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
    if (status === 'loading') return
    if (!NProgress.status) start()
    const timer = setTimeout(() => done(), 300);
    return () => clearTimeout(timer);
  }, [ pathname , status ]);

  return null;
}
