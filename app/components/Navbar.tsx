'use client';

import Link from 'next/link';
import { useState } from 'react'; // Import useState

// Define navLinks outside the component
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/about", label: "About Us" },
  { href: "/investors", label: "Investors" },
  { href: "https://github.com/argon-lab/argon/blob/master/README.md", label: "Docs", target: "_blank" },
  { href: "https://github.com/argon-lab/argon", label: "GitHub", target: "_blank" },
  { href: "https://console.argonlabs.tech", label: "Cloud Console", target: "_blank", isButton: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  return (
    <nav className="bg-brand-surface shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-brand-primary hover:text-brand-secondary">
              Argon
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className={link.isButton 
                    ? "bg-brand-primary text-brand-dark hover:bg-brand-secondary px-4 py-2 rounded-md text-base font-medium transition-colors ml-2"
                    : "text-brand-muted hover:text-brand-text px-3 py-2 rounded-md text-base font-medium"}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-brand-surface inline-flex items-center justify-center p-2 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.target}
                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="text-brand-muted hover:text-brand-text block px-3 py-2 rounded-md text-lg font-medium" // Changed from text-xl to text-lg
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
