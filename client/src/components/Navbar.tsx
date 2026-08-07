import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSplash } from "../context/SplashContext";

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
  const { totalItems } = useCart();
  const { triggerSplash } = useSplash();

  function handleLogout() {
    triggerSplash();
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-surface w-full top-0 border-b border-outline-variant sticky z-50">
      <div className="flex justify-between items-center w-full px-sm md:px-lg max-w-container-max mx-auto h-16">
        <Link to="/dashboard" className="font-bold text-primary text-xl md:text-2xl tracking-tight">
          Cyber<span className="text-primary">Spice</span>
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
          <Link to="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-xs bg-surface-container-low border border-outline-variant rounded-full px-sm py-xs hover:border-primary transition-colors">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
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
            <Link to="/login" className="bg-primary text-on-primary px-sm py-xs rounded-lg text-label-md font-label-md hover:opacity-90 transition-opacity">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}