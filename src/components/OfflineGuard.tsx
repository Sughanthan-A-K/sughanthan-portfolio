"use client";

import { useEffect, useState } from "react";

export default function OfflineGuard() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    if (!navigator.onLine) setOffline(true);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  useEffect(() => {
    if (offline) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [offline]);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]">
      {/* Animated broken-connection icon */}
      <div className="relative mb-8">
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-primary/30 animate-ping" />
        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
          {/* Wifi-off icon */}
          <svg
            className="w-14 h-14 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            {/* Wifi arcs */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"
              opacity={0.3}
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2c-3.87-3.87-10.13-3.87-14 0z"
              opacity={0.5}
            />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
            {/* Slash line */}
            <line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              strokeLinecap="round"
              strokeWidth={2}
              className="text-red-400"
              stroke="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h2
        className="text-2xl sm:text-3xl font-bold mb-3 text-center px-6"
        style={{ color: "var(--text-primary, #e4e4ed)" }}
      >
        No Internet Connection
      </h2>
      <p
        className="text-sm sm:text-base text-center max-w-sm px-6 mb-8"
        style={{ color: "var(--text-muted, #8888a0)" }}
      >
        Please check your network connection and try again.
      </p>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0s" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
      <p
        className="text-xs mt-3"
        style={{ color: "var(--text-dimmed, #666678)" }}
      >
        Waiting for connection…
      </p>
    </div>
  );
}
