// /Users/jakewang/dev/argon-website/app/terms/page.tsx
export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 sm:py-16 text-brand-text">
      <div className="bg-brand-surface p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-brand-primary">Terms of Service</h1>
        <p className="mb-4 text-brand-text-darker">Last updated: May 28, 2025</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">1. Agreement to Terms</h2>
        <p className="mb-4 text-brand-text-darker">
          By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">2. Use of Our Services</h2>
        <p className="mb-4 text-brand-text-darker">
          You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the services:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4 text-brand-text-darker">
          <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
          <li>To engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the website, or which, as determined by us, may harm Argon or users of the website.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">3. Intellectual Property</h2>
        <p className="mb-4 text-brand-text-darker">
          The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by ArgonLabs, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>

        {/* Add more sections as needed, e.g., Termination, Disclaimer of Warranties, Limitation of Liability, Governing Law, Changes to Terms, Contact Us */}
        <p className="mt-8 text-brand-text-darker">
          This is a placeholder Terms of Service. You should replace this content with your own comprehensive terms tailored to your specific services and legal requirements.
        </p>
      </div>
    </div>
  );
}
