import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Bookings from "./pages/Bookings";
import Plots from "./pages/Plots";
import PlotDetails from "./pages/PlotDetails";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import AddEmployee from "./pages/AddEmployee";
import ViewEmployees from "./pages/ViewEmployees";
import ViewHelpers from "./pages/ViewHelpers";
import AddHelper from "./pages/AddHelper";
import AddPartyPlot from "./pages/AddPartyPlot";
import ViewPartyPlots from "./pages/Viewpartyplots";
import BookingAdd from "./pages/BookingAdd";
import ViewBookings from "./Viewbookings";

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
            <Route path="/bookingAdd/:id?" element={<BookingAdd />} />
            <Route path="/bookings" element={<ViewBookings />} />
            <Route path="/plots" element={<Plots />} />
            <Route path="/plots/:id" element={<PlotDetails />} />
            <Route path="/more" element={<More />} />
            <Route path="/users" element={<More />} />
            <Route path="/settings" element={<More />} />

            <Route path="/add-employee/:id?" element={<AddEmployee />} />
            <Route path="/view-employees" element={<ViewEmployees />} />

            <Route path="/add-helper/:id?" element={<AddHelper />} />
            <Route path="/view-helpers" element={<ViewHelpers />} />

            <Route path="/add-party-plot/:id?" element={<AddPartyPlot />} />
            <Route path="/view-party-plots" element={<ViewPartyPlots />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
