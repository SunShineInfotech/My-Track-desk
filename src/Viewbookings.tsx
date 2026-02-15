import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Calendar,
  User,
  Phone,
  MapPin,
  Users,
  IndianRupee,
  CalendarIcon,
} from "lucide-react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const bookingStatusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  partial: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
};

const ViewBookings = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();

  const server_url = localStorage.getItem("server_url") || "/api/";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [eventDateFilter, setEventDateFilter] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", "1");

      const response = await axios.post(
        `https://sunshineproduct.in/party_plote_booking_system/api/booking.php`,
        formData,
      );

      if (response.data.status === "1" && response.data.result) {
        setBookings(response.data.result);
        setMessage({ type: "", text: "" });
      } else {
        setBookings([]);
        setMessage({
          type: "error",
          text: response.data.error || "No bookings found",
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching bookings",
      });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    setDeleteLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", "4");
      formData.append("id", selectedBooking.id);

      const response = await axios.post(
        `https://sunshineproduct.in/party_plote_booking_system/api/booking.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === "1") {
        setMessage({
          type: "success",
          text: "Booking deleted successfully",
        });
        setShowDeleteDialog(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to delete booking",
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      setMessage({
        type: "error",
        text: "An error occurred while deleting booking",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (booking: any) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      !searchTerm ||
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.number?.includes(searchTerm) ||
      booking.function_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.party_plot_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBookingStatus =
      bookingStatusFilter === "all" ||
      booking.booking_status === bookingStatusFilter;

    const matchesPaymentStatus =
      paymentStatusFilter === "all" ||
      booking.payment_status === paymentStatusFilter;

    const matchesEventDate =
      !eventDateFilter ||
      format(new Date(booking.event_date), "yyyy-MM-dd") ===
        format(eventDateFilter, "yyyy-MM-dd");

    return (
      matchesSearch &&
      matchesBookingStatus &&
      matchesPaymentStatus &&
      matchesEventDate
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setSearchTerm("");
    setBookingStatusFilter("all");
    setPaymentStatusFilter("all");
    setEventDateFilter(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    bookingStatusFilter !== "all" ||
    paymentStatusFilter !== "all" ||
    eventDateFilter;

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
        <Link to="/bookingAdd" className="hidden md:block">
          <Button className="shadow-primary-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={cn(
            "p-4 rounded-lg border",
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800",
          )}
        >
          {message.text}
        </div>
      )}

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
            !showFilters && "hidden md:flex",
          )}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search by customer, phone, event, or plot..."
            className="flex h-10 w-full md:flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Booking Status Filter */}
          <Select
            value={bookingStatusFilter}
            onValueChange={setBookingStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Booking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Status Filter */}
          <Select
            value={paymentStatusFilter}
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          {/* Event Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !eventDateFilter && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDateFilter
                  ? format(eventDateFilter, "MMM dd, yyyy")
                  : "Event Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={eventDateFilter}
                onSelect={setEventDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading bookings...</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden md:block bg-card rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Booking ID
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Event Details
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Party Plot
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
                {paginatedBookings.map((booking) => {
                  const remainingAmount =
                    Number(booking.price) - Number(booking.advance_amount || 0);
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-mono text-sm">#{booking.id}</p>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.number}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">
                            {booking.function_name || "Event"}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(
                              new Date(booking.event_date),
                              "MMM dd, yyyy",
                            )}
                          </p>
                          {booking.total_guests > 0 && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {booking.total_guests} guests
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {booking.party_plot_name || "-"}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-semibold">
                            ₹{Number(booking.price).toLocaleString()}
                          </p>
                          {booking.advance_amount > 0 && (
                            <>
                              <p className="text-xs text-green-600">
                                Paid: ₹
                                {Number(
                                  booking.advance_amount,
                                ).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: ₹{remainingAmount.toLocaleString()}
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full capitalize inline-block w-fit",
                              bookingStatusStyles[booking.booking_status],
                            )}
                          >
                            {booking.booking_status}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full capitalize inline-block w-fit",
                              paymentStatusStyles[booking.payment_status],
                            )}
                          >
                            {booking.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/bookingAdd/${booking.id}`)
                            }
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(booking)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {paginatedBookings.map((booking) => {
            const remainingAmount =
              Number(booking.price) - Number(booking.advance_amount || 0);
            return (
              <div
                key={booking.id}
                className="bg-card rounded-xl p-4 shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{booking.id}
                    </p>
                    <h3 className="font-semibold">{booking.customer_name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {booking.number}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full capitalize",
                        bookingStatusStyles[booking.booking_status],
                      )}
                    >
                      {booking.booking_status}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full capitalize",
                        paymentStatusStyles[booking.payment_status],
                      )}
                    >
                      {booking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.function_name || "Event"}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(booking.event_date), "MMM dd")}
                    </span>
                  </div>
                  {booking.party_plot_name && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.party_plot_name}</span>
                    </div>
                  )}
                  {booking.total_guests > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{booking.total_guests} guests</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-lg font-bold">
                        ₹{Number(booking.price).toLocaleString()}
                      </p>
                    </div>
                    {booking.advance_amount > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-green-600">
                          Paid: ₹
                          {Number(booking.advance_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: ₹{remainingAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/bookingAdd/${booking.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(booking)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
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

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Get started by creating your first booking"}
          </p>
          {!hasActiveFilters && (
            <Link to="/bookingAdd">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Booking
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Mobile Add Button */}
      <Link to="/bookingAdd" className="md:hidden fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-lg h-14 w-14 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Trash2
                style={{ width: "30px", height: "30px", color: "#dc2626" }}
              />
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#dc2626" }}>
              Delete Booking?
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>
              Are you sure you want to delete booking for{" "}
              <strong>{selectedBooking?.customer_name}</strong>? This action
              cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedBooking(null);
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ opacity: deleteLoading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                style={{ opacity: deleteLoading ? 0.6 : 1 }}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
