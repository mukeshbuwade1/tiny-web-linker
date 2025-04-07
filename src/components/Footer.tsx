
const Footer = () => {
  return (
    <footer className="py-6 mt-12 border-t">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TheUrlShortener. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
