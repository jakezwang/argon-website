import '../styles/globals.css';
import Navbar from './components/Navbar'; // Import Navbar
import Link from 'next/link'; // Import Link for Footer

export const metadata = {
  title: 'ArgonLabs - Agile MongoDB Management',
  description: 'Revolutionizing MongoDB workflows with Git-like branching, stateless compute, and S3-backed versioning for enhanced developer productivity.',
  icons: {
    icon: '/argon-logo.png', // Path to your icon in the public folder
    apple: '/argon-logo.png', // For Apple touch icon
  },
};

const Footer = () => (
  <footer className="bg-brand-surface border-t border-brand-muted mt-auto py-8 text-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-brand-muted text-sm">
        &copy; {new Date().getFullYear()} ArgonLabs. All rights reserved.
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
      <body className="bg-gray-950 text-white flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
