
import { Card, CardContent } from "@/components/ui/card";
import { Link, Zap, Globe } from "lucide-react";

const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Link className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-xl font-medium">Fast Links</h3>
          <p className="text-center text-sm text-muted-foreground">
            Generate short links in seconds
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Zap className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-xl font-medium">Instant Redirect</h3>
          <p className="text-center text-sm text-muted-foreground">
            Redirects happen instantly
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Globe className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-xl font-medium">Global Access</h3>
          <p className="text-center text-sm text-muted-foreground">
            Access your links from anywhere
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
