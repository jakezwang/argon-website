"use client";

// Flips between the light and dark palettes and remembers the choice.
// With no saved choice the stylesheet follows the system setting.
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("argon.theme", next);
    } catch {
      /* The choice still applies to this page view. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch color theme"
      title="Switch color theme"
      className={`inline-flex h-11 w-11 items-center justify-center rounded-(--radius-control) text-brand-text-darker transition-colors hover:bg-brand-sunken hover:text-brand-text ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="6.25" />
        <path d="M10 3.75a6.25 6.25 0 0 0 0 12.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
