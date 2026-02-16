import { Link } from "react-router-dom";
import {
  User,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  Bell,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    section: "Account",
    items: [
      { icon: User, label: "Profile Details", path: "/profile", badge: null },
      { icon: Database, label: "Sources", path: "/view-sources" },
    ],
  },
  {
    section: "Preferences",
    items: [
      { icon: Settings, label: "Settings", path: "/settings", badge: null },
      {
        icon: Shield,
        label: "Privacy & Security",
        path: "/privacy",
        badge: null,
      },
      { icon: HelpCircle, label: "Help & Support", path: "/help", badge: null },
    ],
  },
];

const More = () => {
  return (
    <div className="p-4 space-y-6">
      {/* User Card */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">AD</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Admin User</h2>
            <p className="text-sm text-muted-foreground">admin@partyplot.com</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuItems.map((section) => (
        <div key={section.section}>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">
            {section.section}
          </h3>
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            {section.items.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                  index !== section.items.length - 1 &&
                    "border-b border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button className="w-full bg-card rounded-xl shadow-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log Out</span>
      </button>

      {/* Version Info */}
      <p className="text-center text-xs text-muted-foreground">
        PartyPlot Booking System v1.0.0
      </p>
    </div>
  );
};

export default More;
