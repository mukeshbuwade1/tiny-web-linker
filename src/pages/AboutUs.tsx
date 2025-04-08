
import React from 'react';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link2, Zap, Shield, Gift } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="About Us - UrlZip"
        description="Learn more about UrlZip, the simple and ad-free URL shortener service."
        url="https://urlzip.in/about-us"
      />
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">About UrlZip</h1>
              <p className="text-lg text-gray-600">
                Making the web more accessible, one shortened URL at a time.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 rounded-xl p-8 mb-6">
                <div className="flex items-center justify-center mb-6">
                  <Link2 className="h-16 w-16 text-primary" />
                </div>
                <p className="text-gray-700 mb-4">
                  UrlZip was founded in 2025 with a simple mission: to provide a clean, fast, and reliable URL shortening service without the clutter of advertisements or tracking.
                </p>
                <p className="text-gray-700">
                  We believe that sharing links should be simple and straightforward. Our team of passionate developers and designers work tirelessly to ensure that UrlZip remains the most user-friendly URL shortener on the web.
                </p>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">What Makes Us Different</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">
                    Our infrastructure ensures quick URL generation and redirection.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Privacy Focused</h3>
                  <p className="text-gray-600 text-sm">
                    We don't track your data or sell it to third parties.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Gift className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Always Free</h3>
                  <p className="text-gray-600 text-sm">
                    No premium plans or hidden fees. All features are free.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-gray-700 mb-6">
                UrlZip is maintained by a small, dedicated team of developers who are passionate about creating useful tools for the web. We're constantly working to improve our service and add new features.
              </p>
              <p className="text-gray-700">
                Have ideas or suggestions? We'd love to hear from you! Visit our <a href="/contact-us" className="text-primary hover:underline">contact page</a> to get in touch.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
