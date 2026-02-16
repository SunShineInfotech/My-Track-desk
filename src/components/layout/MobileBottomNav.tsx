import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, Plus, Calendar, MoreHorizontal } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/view-sources" },
  { icon: null, label: "Add", path: "/add-source" }, // Center FAB
  { icon: Calendar, label: "Booking", path: "/bookings" },
  { icon: MoreHorizontal, label: "More", path: "/more" },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 h-16 relative">
        {navItems.map((item, index) => {
          // Center floating action button
          if (index === 2) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="absolute left-1/2 -translate-x-1/2 -top-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-primary-glow fab-pulse transition-transform hover:scale-105 active:scale-95">
                  <Plus className="w-7 h-7 text-primary-foreground" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors min-w-[64px]",
                isActive(item.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
