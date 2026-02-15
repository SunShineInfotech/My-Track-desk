import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopHeader />
        <MobileHeader />
        
        <main className="flex-1 pb-24 md:pb-0">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
        
        <MobileBottomNav />
      </div>
    </div>
  );
}