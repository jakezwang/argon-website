// /Users/jakewang/dev/argon-website/app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 sm:py-16 text-brand-text">
      <div className="bg-brand-surface p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-brand-primary">Privacy Policy</h1>
        <p className="mb-4 text-brand-text-darker">Last updated: May 28, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">1. Introduction</h2>
        <p className="mb-4 text-brand-text-darker">
          Welcome to Argon! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">2. Information We Collect</h2>
        <p className="mb-4 text-brand-text-darker">
          We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
        </p>
        <p className="mb-4 text-brand-text-darker">
          The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4 text-brand-text-darker">
          <li>Name and Contact Data (e.g., email address, phone number)</li>
          <li>Usage Data (e.g., IP address, browser type, pages visited)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-brand-primary-light">3. How We Use Your Information</h2>
        <p className="mb-4 text-brand-text-darker">
          We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>

        {/* Add more sections as needed, e.g., Sharing Your Information, Security of Your Information, Your Privacy Rights, Contact Us */}
        <p className="mt-8 text-brand-text-darker">
          This is a placeholder Privacy Policy. You should replace this content with your own comprehensive policy tailored to your specific practices.
        </p>
      </div>
    </div>
  );
}
