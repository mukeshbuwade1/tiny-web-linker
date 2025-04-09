
import React from 'react';
import Meta from '@/components/Meta';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with actual form submission logic
    console.log('Form submitted');
    // For future implementation: Form validation and API submission
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Meta
        title="Contact Us - UrlZip"
        description="Get in touch with the UrlZip team for support or inquiries."
        url="https://urlzip.in/contact-us"
      />
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions or feedback? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">con_urlzip@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+91 9770675479</p>
                    </div>
                  </div>
                  
                  {/* <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">
                        Street<br />
                        Mumbai <br />
                        India
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                  </div>
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
