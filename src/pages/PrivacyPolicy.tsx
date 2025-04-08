import Meta from '@/components/Meta';
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Privacy Policy - urlzip"
        description="Read our privacy policy. We do not collect any personal data."
        url="https://urlzip.in/privacy-policy"
      />
      <div className="container mx-auto px-4 flex-1">
        <header className="py-6">
          <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
        </header>
        <main className="py-12 text-gray-800 max-w-3xl mx-auto">
          <p className="mb-4">
            We value your privacy. This privacy policy outlines how we handle your information.
          </p>

          <h2 className="text-xl font-semibold mb-2">1. No User Data Collection</h2>
          <p className="mb-4">
            Our URL shortener does not collect or store any personal data from users. We do not use cookies, tracking technologies, or any form of user analytics.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Third-Party Links</h2>
          <p className="mb-4">
            Our service may redirect to third-party websites. We are not responsible for the privacy practices of those websites.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Contact Us</h2>
          <p>If you have any questions, contact us at <span className="text-blue-600 underline">your-email@example.com</span>.</p>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
