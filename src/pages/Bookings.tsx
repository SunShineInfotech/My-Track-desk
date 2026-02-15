import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Filter, ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Mock bookings data
const allBookings = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    mobile: "+91 98765 43210",
    eventType: "Wedding Reception",
    date: new Date("2026-02-08"),
    time: "6:00 PM",
    plotName: "Grand Garden",
    guests: 350,
    status: "confirmed",
    amount: 85000,
  },
  {
    id: "2",
    customerName: "Priya Patel",
    mobile: "+91 87654 32109",
    eventType: "Birthday Party",
    date: new Date("2026-02-10"),
    time: "4:00 PM",
    plotName: "Royal Lawn",
    guests: 120,
    status: "pending",
    amount: 35000,
  },
  {
    id: "3",
    customerName: "Amit Kumar",
    mobile: "+91 76543 21098",
    eventType: "Corporate Event",
    date: new Date("2026-02-12"),
    time: "10:00 AM",
    plotName: "Celebration Hall",
    guests: 200,
    status: "confirmed",
    amount: 55000,
  },
  {
    id: "4",
    customerName: "Neha Gupta",
    mobile: "+91 65432 10987",
    eventType: "Engagement Ceremony",
    date: new Date("2026-02-14"),
    time: "7:00 PM",
    plotName: "Grand Garden",
    guests: 180,
    status: "pending",
    amount: 45000,
  },
  {
    id: "5",
    customerName: "Vikram Singh",
    mobile: "+91 54321 09876",
    eventType: "Anniversary Party",
    date: new Date("2026-02-20"),
    time: "5:00 PM",
    plotName: "Royal Lawn",
    guests: 100,
    status: "cancelled",
    amount: 30000,
  },
  {
    id: "6",
    customerName: "Meera Joshi",
    mobile: "+91 43210 98765",
    eventType: "Wedding Reception",
    date: new Date("2026-02-25"),
    time: "6:00 PM",
    plotName: "Grand Garden",
    guests: 400,
    status: "confirmed",
    amount: 95000,
  },
];

const statusStyles = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

const ITEMS_PER_PAGE = 5;

const Bookings = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filteredBookings = allBookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesStartDate = !startDate || booking.date >= startDate;
    const matchesEndDate = !endDate || booking.date <= endDate;
    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = startDate || endDate || statusFilter;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">
            Manage and view all your bookings
          </p>
        </div>
        <Link to="/add-booking" className="hidden md:block">
          <Button className="shadow-primary-glow">New Booking</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Mobile Filter Toggle */}
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

        <div
          className={cn(
            "flex flex-col md:flex-row gap-3",
            !showFilters && "hidden md:flex"
          )}
        >
          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
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
        Showing {paginatedBookings.length} of {filteredBookings.length} bookings
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground">
                Customer
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Event
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Date & Time
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Plot
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.mobile}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-sm">{booking.eventType}</td>
                <td className="p-4 text-sm">
                  <div>
                    <p>{format(booking.date, "MMM dd, yyyy")}</p>
                    <p className="text-muted-foreground">{booking.time}</p>
                  </div>
                </td>
                <td className="p-4 text-sm">{booking.plotName}</td>
                <td className="p-4 text-sm font-medium">
                  ₹{booking.amount.toLocaleString()}
                </td>
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
                <td className="p-4">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedBookings.map((booking) => (
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
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>
                  {format(booking.date, "MMM dd")} • {booking.time}
                </span>
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

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="font-semibold text-primary">
                ₹{booking.amount.toLocaleString()}
              </p>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or create a new booking
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookings;