
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-6">
    <div className="flex items-center gap-2 justify-center">
      <Link to="/">
      <img className="w-[150px]" src="/img/logo.png" />
      </Link>
    </div>
  </header>
  );
};

export default Header;
