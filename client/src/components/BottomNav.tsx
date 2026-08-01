import { Link, useLocation } from "react-router-dom";

const items = [
  { label: "Home", icon: "home", path: "/dashboard" },
  { label: "Buy", icon: "storefront", path: "/buy" },
  { label: "Sell", icon: "sell", path: "/sell" },
  { label: "Orders", icon: "receipt_long", path: "/orders" },
  { label: "Account", icon: "person", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant md:hidden">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] ${
              isActive ? "text-primary" : "text-secondary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
