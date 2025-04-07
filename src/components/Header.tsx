
import { Link2 } from "lucide-react";

const Header = () => {
  return (
    <header className="py-6">
      <div className="flex items-center gap-2 justify-center">
        <Link2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">UrlShortener</h1>
      </div>
    </header>
  );
};

export default Header;
