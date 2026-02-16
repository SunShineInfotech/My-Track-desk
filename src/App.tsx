import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Search from "./pages/Search";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import ViewBookings from "./Viewbookings";
import AddSource from "./pages/AddSource";
import ViewSources from "./pages/ViewSources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bookings" element={<ViewBookings />} />
            <Route path="/more" element={<More />} />
            <Route path="/users" element={<More />} />
            <Route path="/settings" element={<More />} />

            {/* Track desk */}
            {/* Source */}
            <Route path="/add-source/:id?" element={<AddSource />} />
            <Route path="/view-sources" element={<ViewSources />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
