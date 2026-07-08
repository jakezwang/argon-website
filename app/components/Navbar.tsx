'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import PeriodicTile from './PeriodicTile';

const navLinks = [
  { href: '/agents', label: 'Agents' },
  { href: '/features', label: 'Features' },
  { href: '/demo', label: 'Demo' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-edge bg-brand-dark/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Argon home">
            <PeriodicTile size="sm" />
            <span className="font-mono text-lg text-brand-text">argon</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 font-mono text-[13px] transition-colors ${
                    isActive
                      ? 'text-brand-primary'
                      : 'text-brand-text-darker hover:text-brand-text'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <span className="mx-2 h-4 w-px bg-brand-edge" aria-hidden="true" />
            <a
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-brand-edge px-3.5 py-1.5 font-mono text-[13px] text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              <GitHubIcon />
              Star on GitHub
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-2 text-brand-muted hover:text-brand-text md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-brand-edge md:hidden" id="mobile-menu">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block px-2 py-2 font-mono text-sm ${
                  pathname === link.href ? 'text-brand-primary' : 'text-brand-text-darker'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block border border-brand-edge px-2 py-2 text-center font-mono text-sm text-brand-text"
              onClick={() => setIsOpen(false)}
            >
              Star on GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
