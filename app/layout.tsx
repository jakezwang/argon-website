import '../styles/globals.css';
import Navbar from './components/Navbar'; // Import Navbar
import Link from 'next/link'; // Import Link for Footer

export const metadata = {
  metadataBase: new URL('https://argonlabs.tech'), // Added metadataBase
  title: 'ArgonLabs - Git-like Branching & Time Travel for MongoDB',
  description: 'Argon is an open-source versioning layer for MongoDB: branch your database in milliseconds, time-travel through history, and rewind mistakes. Built for AI agent sandboxes.',
  openGraph: {
    title: 'ArgonLabs - Git-like Branching & Time Travel for MongoDB',
    description: 'Open-source Git-like branching, time travel, and rollback for MongoDB. Branch in milliseconds, rewind any mistake, and give AI agents a safe sandbox.',
  },
  icons: {
    icon: '/argon-logo.png', // Path to your icon in the public folder
    apple: '/argon-logo.png', // For Apple touch icon
  },
};

const Footer = () => (
  <footer className="bg-brand-surface border-t border-brand-muted mt-auto py-8 text-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-brand-muted text-sm">
        &copy; {new Date().getFullYear()} Argon Labs. All rights reserved.
      </p>
      <p className="text-brand-muted text-sm mt-1">
        <Link href="/privacy" className="hover:text-brand-primary">
          Privacy Policy
        </Link>
        {' | '}
        <Link href="/terms" className="hover:text-brand-primary">
          Terms of Service
        </Link>
      </p>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-brand-dark text-brand-text flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
