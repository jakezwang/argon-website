"use client";

import { Analytics, type BeforeSend } from "@vercel/analytics/next";

const beforeSend: BeforeSend = (event) => {
  if (navigator.doNotTrack === "1") return null;

  const url = new URL(event.url);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
};

export default function WebsiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
