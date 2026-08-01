import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", path: "/dashboard" },
  { label: "Buy", path: "/buy" },
  { label: "Sell", path: "/sell" },
  { label: "Orders", path: "/orders" },
  { label: "Insights", path: "/insights" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-surface w-full top-0 border-b border-outline-variant sticky z-50">
      <div className="flex justify-between items-center w-full px-sm md:px-lg max-w-container-max mx-auto h-16">
        <Link to="/dashboard" className="font-bold text-primary text-xl md:text-2xl tracking-tight">
          Cyber<span className="text-primary-container">Spice</span>
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
                    ? "text-primary border-b-2 border-primary pb-1 font-label-md text-label-md"
                    : "text-secondary hover:text-primary transition-colors font-label-md text-label-md"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-sm">
          <div className="hidden lg:flex items-center bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-secondary mr-2 text-[18px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-40 outline-none placeholder:text-outline"
              placeholder="Search marketplace..."
              type="text"
            />
          </div>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-xs bg-surface-container-low border border-outline-variant rounded-full px-sm py-xs hover:border-primary transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden md:block text-label-md font-label-md text-on-surface max-w-[100px] truncate">
                  {user.name}
                </span>
                <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-outline-variant shadow-lg rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <Link to="/profile" className="flex items-center gap-sm px-sm py-xs hover:bg-surface-container-low text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span> Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-sm px-sm py-xs hover:bg-surface-container-low text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span> My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-sm px-sm py-xs hover:bg-error-container text-error text-body-sm border-t border-outline-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-on-primary px-sm py-xs rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
