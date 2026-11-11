"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { track } from "./Funnel";
import { product } from "../product";
import { usePathname } from "next/navigation";
import PeriodicTile from "./PeriodicTile";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/agents", label: "Agents" },
  { href: "/features", label: "Features" },
  { href: "/demo", label: "How it works" },
  { href: "/quickstart", label: "Quickstart" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-brand-edge bg-brand-bg/85 backdrop-blur-md"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2.5"
            aria-label="Argon home"
            onClick={() => setIsOpen(false)}
          >
            <PeriodicTile size="sm" />
            <span className="text-lg font-semibold tracking-tight text-brand-text [font-stretch:112%]">
              argon
            </span>
          </Link>
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors ${isActive(link.href) ? "text-brand-text after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-brand-primary" : "text-brand-text-darker hover:text-brand-text"}`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-brand-text-darker transition-colors hover:text-brand-text"
            >
              <GitHubIcon />
              GitHub
            </a>
            <ThemeToggle />
            <a
              href={product.demo}
              onClick={() => track("demo_opened")}
              className="btn-solid ml-2 min-h-11 px-4 text-sm"
            >
              {product.demoLabel}
            </a>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              ref={menuButton}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-(--radius-control) text-brand-text-darker hover:bg-brand-sunken hover:text-brand-text"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-brand-edge lg:hidden"
          id="mobile-menu"
        >
          <div className="space-y-0.5 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex min-h-12 items-center text-lg font-medium ${isActive(link.href) ? "text-brand-primary" : "text-brand-text"}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-brand-edge pt-5">
              <a
                href={product.demo}
                onClick={() => {
                  setIsOpen(false);
                  track("demo_opened");
                }}
                className="btn-solid min-h-11 text-sm"
              >
                {product.demoLabel}
              </a>
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-text-darker hover:text-brand-text"
                onClick={() => setIsOpen(false)}
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
