
import Header from "@/components/Header";
import UrlShortener from "@/components/UrlShortener";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import Meta from "@/components/Meta";
import FAQ from "@/components/FAQ";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
       <Meta
        title="Free URL Shortener | Shorten Long URLs | URL Link Shortener"
        description="Quickly shorten, customize, and share links with our free URL shortener. Create concise, trackable URLs for social media, marketing campaigns, and more."
        keywords="url shortener, link shortener, short url, tiny url, url zip, free url shortener, shorten link, custom url, url redirect, link management"
        url="https://urlzip.in/"
      />
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Simplify Your Links with Our Free URL Shortener
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create shorter, more manageable links that never expire. Perfect for social media, marketing campaigns, and more.
            </p>
            
            <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 rounded-xl p-8 mb-12">
              <UrlShortener />
            </div>
            
            <Stats />
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Paste your long URL</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your lengthy URL into the input field
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Click shorten</h3>
                  <p className="text-muted-foreground text-sm">
                    Our system instantly creates a shortened URL
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Use your link</h3>
                  <p className="text-muted-foreground text-sm">
                    Copy and share your shortened URL anywhere
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">URL Shortener Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Enhance Brand Visibility</h3>
                  <p className="text-muted-foreground">Create branded short links that reinforce your identity across platforms.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Improve Click-Through Rates</h3>
                  <p className="text-muted-foreground">Short, clean links look more professional and encourage more clicks.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Track Link Performance</h3>
                  <p className="text-muted-foreground">Monitor clicks and engagement to optimize your content strategy.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Save Character Space</h3>
                  <p className="text-muted-foreground">Perfect for platforms with character limits like Twitter/X or SMS messages.</p>
                </div>
              </div>
              <Link to="/about-us" className="inline-flex items-center text-primary hover:text-primary/80">
                Learn more about our URL shortener service <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="text-left">
                <FAQ />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
