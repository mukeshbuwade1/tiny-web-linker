
import Header from "@/components/Header";
import UrlShortener from "@/components/UrlShortener";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1">
        <Header />
        
        <main className="py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Simplify Your Links
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create shorter, more manageable links that never expire.
            </p>
            
            <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 rounded-xl p-8 mb-12">
              <UrlShortener />
            </div>
            
            <Stats />
            
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="text-lg font-medium mb-2">Paste your long URL</h4>
                  <p className="text-muted-foreground text-sm">
                    Enter your lengthy URL into the input field
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="text-lg font-medium mb-2">Click shorten</h4>
                  <p className="text-muted-foreground text-sm">
                    Our system instantly creates a shortened URL
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="text-lg font-medium mb-2">Use your link</h4>
                  <p className="text-muted-foreground text-sm">
                    Copy and share your shortened URL anywhere
                  </p>
                </div>
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
