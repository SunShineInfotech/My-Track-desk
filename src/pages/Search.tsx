import { useState } from "react";
import { Search as SearchIcon, Filter, Calendar, MapPin, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock search results
const allBookings = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    mobile: "+91 98765 43210",
    eventType: "Wedding Reception",
    date: "Feb 8, 2026",
    plotName: "Grand Garden",
    guests: 350,
    status: "confirmed",
    amount: "₹85,000",
  },
  {
    id: "2",
    customerName: "Priya Patel",
    mobile: "+91 87654 32109",
    eventType: "Birthday Party",
    date: "Feb 10, 2026",
    plotName: "Royal Lawn",
    guests: 120,
    status: "pending",
    amount: "₹35,000",
  },
  {
    id: "3",
    customerName: "Amit Kumar",
    mobile: "+91 76543 21098",
    eventType: "Corporate Event",
    date: "Feb 12, 2026",
    plotName: "Celebration Hall",
    guests: 200,
    status: "confirmed",
    amount: "₹55,000",
  },
  {
    id: "4",
    customerName: "Neha Gupta",
    mobile: "+91 65432 10987",
    eventType: "Engagement Ceremony",
    date: "Feb 14, 2026",
    plotName: "Grand Garden",
    guests: 180,
    status: "pending",
    amount: "₹45,000",
  },
  {
    id: "5",
    customerName: "Vikram Singh",
    mobile: "+91 54321 09876",
    eventType: "Anniversary Party",
    date: "Feb 20, 2026",
    plotName: "Royal Lawn",
    guests: 100,
    status: "cancelled",
    amount: "₹30,000",
  },
];

const statusStyles = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlot, setSelectedPlot] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.mobile.includes(searchQuery) ||
      booking.eventType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlot = !selectedPlot || booking.plotName === selectedPlot;
    const matchesStatus = !selectedStatus || booking.status === selectedStatus;

    return matchesSearch && matchesPlot && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlot("");
    setSelectedStatus("");
  };

  const hasActiveFilters = searchQuery || selectedPlot || selectedStatus;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-card"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-secondary")}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>

        {/* Filters */}
        <div
          className={cn(
            "flex flex-col md:flex-row gap-3",
            !showFilters && "hidden md:flex"
          )}
        >
          <Select value={selectedPlot} onValueChange={setSelectedPlot}>
            <SelectTrigger className="w-full md:w-[200px] bg-card">
              <SelectValue placeholder="All Plots" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Plots</SelectItem>
              <SelectItem value="Grand Garden">Grand Garden</SelectItem>
              <SelectItem value="Royal Lawn">Royal Lawn</SelectItem>
              <SelectItem value="Celebration Hall">Celebration Hall</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px] bg-card">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="hidden md:flex"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredBookings.length} result{filteredBookings.length !== 1 && "s"} found
      </p>

      {/* Results - Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Event</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Plot</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Guests</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">{booking.mobile}</p>
                  </div>
                </td>
                <td className="p-4 text-sm">{booking.eventType}</td>
                <td className="p-4 text-sm">{booking.date}</td>
                <td className="p-4 text-sm">{booking.plotName}</td>
                <td className="p-4 text-sm">{booking.guests}</td>
                <td className="p-4 text-sm font-medium">{booking.amount}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                      statusStyles[booking.status as keyof typeof statusStyles]
                    )}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results - Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-card rounded-xl p-4 shadow-card space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{booking.customerName}</h3>
                <p className="text-sm text-muted-foreground">{booking.mobile}</p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                  statusStyles[booking.status as keyof typeof statusStyles]
                )}
              >
                {booking.status}
              </span>
            </div>

            <p className="text-sm font-medium">{booking.eventType}</p>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{booking.plotName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{booking.guests} guests</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-sm font-semibold text-primary">{booking.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;