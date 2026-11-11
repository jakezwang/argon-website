"use client";
import { useEffect, useState } from "react";
export const events = ["demo_opened", "quickstart_opened"] as const;
type Event = (typeof events)[number];
export function track(event: Event) {
  try {
    if (
      navigator.doNotTrack === "1" ||
      localStorage.getItem("argon.analytics") !== "yes"
    )
      return;
    if (!events.includes(event)) return;
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    /* Storage/network restrictions must not break navigation. */
  }
}
export function ActionLink({
  href,
  event,
  children,
  className,
}: {
  href: string;
  event: Event;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className} onClick={() => track(event)}>
      {children}
    </a>
  );
}
export default function FunnelChoice() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    try {
      setEnabled(localStorage.getItem("argon.analytics") === "yes");
    } catch {}
  }, []);
  return (
    <label className="mt-10 flex max-w-2xl items-start gap-2.5 text-xs leading-6 text-brand-text-darker">
      <input
        className="mt-1.5 accent-brand-primary"
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          setEnabled(e.target.checked);
          try {
            localStorage.setItem(
              "argon.analytics",
              e.target.checked ? "yes" : "no",
            );
          } catch {}
        }}
      />
      <span>
        Share anonymous button counts to help improve the walkthrough. No
        document data or identifiers.{" "}
        <a className="prose-link" href="/privacy">
          Privacy
        </a>
      </span>
    </label>
  );
}
