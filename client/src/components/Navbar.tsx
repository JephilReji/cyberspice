import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/dashboard" },
  { label: "Buy", path: "/buy" },
  { label: "Sell", path: "/sell" },
  { label: "Insights", path: "/insights" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-surface w-full top-0 border-b border-outline-variant sticky z-50">
      <div className="flex justify-between items-center w-full px-sm md:px-lg max-w-container-max mx-auto h-16">
        <Link to="/dashboard" className="text-headline-md font-headline-md font-bold text-primary text-2xl md:text-4xl">
          CyberSpice
        </Link>

        <nav className="hidden md:flex items-center space-x-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1 font-label-md"
                    : "text-secondary hover:text-primary transition-colors font-label-md"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-sm">
          <div className="hidden lg:flex items-center bg-surface-container-low px-sm py-xs rounded-full">
            <span className="material-symbols-outlined text-secondary mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none"
              placeholder="Search marketplace..."
              type="text"
            />
          </div>
          <Link
            to="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}