
import Meta from '@/components/Meta';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Terms & Conditions - urlzip"
        description="Read the terms of service for using our URL shortening platform."
        url="https://urlzip.in/terms-and-conditions"
      />
      <div className="container mx-auto px-4 flex-1">
        <Header />
        <main className="py-12 text-gray-800 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

          <p className="mb-4">
            By using our URL shortening service, you agree to the following terms and conditions. If you do not agree, please do not use our service.
          </p>

          <h2 className="text-xl font-semibold mb-2">1. Use of Service</h2>
          <p className="mb-4">
            The service must be used only for legal purposes. You must not create shortened links that redirect to harmful or illegal content.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Prohibited Content</h2>
          <p className="mb-2">You are not allowed to shorten URLs that redirect to:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Copyright-protected materials (video, audio, images, books, games, etc.)</li>
            <li>Content infringing intellectual property rights</li>
            <li>Unauthorized movie/TV streaming</li>
            <li>File downloads</li>
            <li>Phishing, malware, or viruses</li>
            <li>Suspicious or abusive content</li>
            <li>Pornographic or sexual content</li>
            <li>Violent or prejudiced material</li>
            <li>Drugs, weapons, or alcohol-related content</li>
            <li>Explicit or offensive material</li>
            <li>Pop-ups, scripts, or malicious code</li>
            <li>Pages redirecting to other pages (chain redirects)</li>
            <li>404, blank, or expired links</li>
          </ul>
          <p className="mb-4">
            Any link violating these rules may be disabled without notice. We review URLs and investigate any reports of abuse or spam.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. Disclaimer</h2>
          <p className="mb-4">
            The service is provided "as-is" without warranties. We don't guarantee uptime, accuracy, or link permanence.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
          <p className="mb-4">
            We are not liable for damages resulting from the use or inability to use this service.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms without prior notice. Continued use after updates implies acceptance.
          </p>

          <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
          <p>If you have questions, contact us at <a href="mailto:support@urlzip.in" className="text-primary underline">support@urlzip.in</a>.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
