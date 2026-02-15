import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/search": "Search",
  "/add-booking": "Add Booking",
  "/bookings": "Bookings",
  "/plots": "Party Plots",
  "/more": "More",
  "/settings": "Settings",
  "/users": "Users",
};

export function MobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getTitle = () => {
    // Check for dynamic routes
    if (location.pathname.startsWith("/plots/")) return "Plot Details";
    if (location.pathname.startsWith("/bookings/")) return "Booking Details";
    return pageTitles[location.pathname] || "PartyPlot";
  };

  return (
    <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{getTitle()}</h1>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
}