import { Link, useLocation } from "react-router-dom";

const items = [
  { label: "Home", icon: "home", path: "/dashboard" },
  { label: "Market", icon: "storefront", path: "/buy" },
  { label: "Orders", icon: "receipt_long", path: "/orders" },
  { label: "Account", icon: "person", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant md:hidden">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={
              isActive
                ? "flex flex-col items-center justify-center text-primary font-bold"
                : "flex flex-col items-center justify-center text-secondary"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-label-md font-label-md">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}