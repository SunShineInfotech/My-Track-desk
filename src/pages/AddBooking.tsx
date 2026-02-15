import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const bookingStatusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

const paymentStatusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "partial", label: "Partial", color: "bg-blue-500" },
  { value: "paid", label: "Paid", color: "bg-green-500" },
];

const paymentMethodOptions = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Cheque",
];

const AddBooking = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();
  const { id } = useParams();

  const server_url = localStorage.getItem("server_url") || "/api/";
  const employee_id = localStorage.getItem("employee_id") || "1";

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Dropdown data
  const [partyPlots, setPartyPlots] = useState([]);
  const [caterers, setCaterers] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    party_plot_id: "",
    catering_id: "",
    decorators_id: "",
    booking_date: new Date(),
    event_date: undefined as Date | undefined,
    customer_name: "",
    number: "",
    function_name: "",
    price: "",
    booked_by_user_id: employee_id,
    booking_status: "pending",
    payment_status: "pending",
    advance_amount: "",
    total_guests: "",
    special_requirements: "",
    payment_method: "Cash",
    transaction_mode: "cash",
    transaction_remark: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchDropdownData();
    if (id) {
      setIsEditMode(true);
      fetchBookingDetails(id);
    }
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);

      // Fetch Party Plots
      const plotsData = new FormData();
      plotsData.append("type", "1");
      const plotsResponse = await axios.post(
        `${server_url}api_party_plot.php`,
        plotsData,
      );
      if (plotsResponse.data.status === "1" && plotsResponse.data.result) {
        setPartyPlots(plotsResponse.data.result);
      }

      // Fetch Helpers (Caterers and Decorators)
      const helpersData = new FormData();
      helpersData.append("type", "1");
      const helpersResponse = await axios.post(
        `${server_url}api_helper.php`,
        helpersData,
      );
      if (helpersResponse.data.status === "1" && helpersResponse.data.result) {
        const allHelpers = helpersResponse.data.result;
        // Filter caterers (you can adjust type numbers as needed)
        setCaterers(allHelpers.filter((h: any) => h.type === "1"));
        // Filter decorators
        setDecorators(allHelpers.filter((h: any) => h.type === "8"));
      }

      // Fetch Employees
      const employeesData = new FormData();
      employeesData.append("type", "1");
      const employeesResponse = await axios.post(
        `${server_url}employee.php`,
        employeesData,
      );
      if (
        employeesResponse.data.status === "1" &&
        employeesResponse.data.result
      ) {
        setEmployees(
          employeesResponse.data.result.filter(
            (e: any) => e.employee_status === "1",
          ),
        );
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setMessage({
        type: "error",
        text: "Failed to load form data",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", "1");

      const response = await axios.post(
        `${server_url}api_booking.php`,
        formDataToSend,
      );

      if (response.data.status === "1" && response.data.result) {
        const booking = response.data.result.find(
          (b: any) => b.id === bookingId,
        );
        if (booking) {
          setFormData({
            party_plot_id: booking.party_plot_id || "",
            catering_id: booking.catering_id || "",
            decorators_id: booking.decorators_id || "",
            booking_date: booking.booking_date
              ? new Date(booking.booking_date)
              : new Date(),
            event_date: booking.event_date
              ? new Date(booking.event_date)
              : undefined,
            customer_name: booking.customer_name || "",
            number: booking.number || "",
            function_name: booking.function_name || "",
            price: booking.price || "",
            booked_by_user_id: booking.booked_by_user_id || employee_id,
            booking_status: booking.booking_status || "pending",
            payment_status: booking.payment_status || "pending",
            advance_amount: booking.advance_amount || "",
            total_guests: booking.total_guests || "",
            special_requirements: booking.special_requirements || "",
            payment_method: "Cash",
            transaction_mode: "cash",
            transaction_remark: "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch booking details",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.party_plot_id) {
      newErrors.party_plot_id = "Party plot is required";
    }

    if (!formData.event_date) {
      newErrors.event_date = "Event date is required";
    }

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.number.trim()) {
      newErrors.number = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.number.replace(/\s+/g, ""))) {
      newErrors.number = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (
      formData.advance_amount &&
      Number(formData.advance_amount) > Number(formData.price)
    ) {
      newErrors.advance_amount = "Advance cannot exceed total price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fix the errors in the form",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();

      if (isEditMode) {
        submitData.append("type", "3");
        submitData.append("id", id!);
      } else {
        submitData.append("type", "2");
      }

      submitData.append("party_plot_id", formData.party_plot_id);
      submitData.append("catering_id", formData.catering_id);
      submitData.append("decorators_id", formData.decorators_id);
      submitData.append(
        "booking_date",
        format(formData.booking_date, "yyyy-MM-dd"),
      );
      submitData.append(
        "event_date",
        formData.event_date ? format(formData.event_date, "yyyy-MM-dd") : "",
      );
      submitData.append("customer_name", formData.customer_name);
      submitData.append("number", formData.number);
      submitData.append("function_name", formData.function_name);
      submitData.append("price", formData.price);
      submitData.append("booked_by_user_id", formData.booked_by_user_id);
      submitData.append("booking_status", formData.booking_status);
      submitData.append("payment_status", formData.payment_status);
      submitData.append("advance_amount", formData.advance_amount || "0");
      submitData.append("total_guests", formData.total_guests || "0");
      submitData.append("special_requirements", formData.special_requirements);
      submitData.append("payment_method", formData.payment_method);
      submitData.append("transaction_mode", formData.transaction_mode);
      submitData.append("transaction_remark", formData.transaction_remark);

      const response = await axios.post(
        `${server_url}api_booking.php`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === "1") {
        setShowSuccessDialog(true);
      } else {
        setMessage({
          type: "error",
          text:
            response.data.error ||
            `Failed to ${isEditMode ? "update" : "add"} booking`,
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditMode ? "updating" : "adding"} booking`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/bookings");
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: "", text: "" });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectedPlot = partyPlots.find(
    (p: any) => p.id === formData.party_plot_id,
  );
  const remainingAmount =
    Number(formData.price || 0) - Number(formData.advance_amount || 0);

  if (loadingData) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Booking" : "New Booking"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update booking information below"
            : "Fill in the details to create a new booking"}
        </p>
      </div>

      {message.text && (
        <div
          className={cn(
            "p-4 mb-6 rounded-lg border",
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800",
          )}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Customer Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer_name">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                placeholder="Enter customer name"
                value={formData.customer_name}
                onChange={(e) => updateField("customer_name", e.target.value)}
                className={errors.customer_name ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.customer_name && (
                <p className="text-sm text-red-500">{errors.customer_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                value={formData.number}
                onChange={(e) => updateField("number", e.target.value)}
                className={errors.number ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.number && (
                <p className="text-sm text-red-500">{errors.number}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="function_name">Function/Event Name</Label>
              <Input
                id="function_name"
                placeholder="e.g., Wedding Reception, Birthday Party"
                value={formData.function_name}
                onChange={(e) => updateField("function_name", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Event Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Party Plot <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.party_plot_id}
                onValueChange={(value) => updateField("party_plot_id", value)}
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.party_plot_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select party plot" />
                </SelectTrigger>
                <SelectContent>
                  {partyPlots.map((plot: any) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} - ₹{Number(plot.rent).toLocaleString()}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.party_plot_id && (
                <p className="text-sm text-red-500">{errors.party_plot_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Event Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.event_date && "text-muted-foreground",
                      errors.event_date && "border-red-500",
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.event_date ? (
                      format(formData.event_date, "PPP")
                    ) : (
                      <span>Pick event date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.event_date}
                    onSelect={(date) => updateField("event_date", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.event_date && (
                <p className="text-sm text-red-500">{errors.event_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Catering Service</Label>
              <Select
                value={formData.catering_id || "none"}
                onValueChange={(value) =>
                  updateField("catering_id", value === "none" ? "" : value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select caterer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {caterers.map((caterer: any) => (
                    <SelectItem key={caterer.id} value={caterer.id}>
                      {caterer.name} - {caterer.whatsapp_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Decorator Service</Label>
              <Select
                value={formData.decorators_id || "none"}
                onValueChange={(value) =>
                  updateField("decorators_id", value === "none" ? "" : value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decorator (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {decorators.map((decorator: any) => (
                    <SelectItem key={decorator.id} value={decorator.id}>
                      {decorator.name} - {decorator.whatsapp_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_guests">Expected Guests</Label>
              <Input
                id="total_guests"
                type="number"
                placeholder="Number of guests"
                value={formData.total_guests}
                onChange={(e) => updateField("total_guests", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Booked By</Label>
              <Select
                value={formData.booked_by_user_id}
                onValueChange={(value) =>
                  updateField("booked_by_user_id", value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.employee_name} ({emp.employee_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requirements">Special Requirements</Label>
            <Textarea
              id="special_requirements"
              placeholder="Any special requirements or notes..."
              value={formData.special_requirements}
              onChange={(e) =>
                updateField("special_requirements", e.target.value)
              }
              disabled={loading}
              rows={3}
            />
          </div>
        </div>

        {/* Pricing & Payment */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Pricing & Payment</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Total Price (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter total price"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={errors.price ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance_amount">Advance Amount (₹)</Label>
              <Input
                id="advance_amount"
                type="number"
                placeholder="Enter advance amount"
                value={formData.advance_amount}
                onChange={(e) => updateField("advance_amount", e.target.value)}
                className={errors.advance_amount ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.advance_amount && (
                <p className="text-sm text-red-500">{errors.advance_amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => updateField("payment_method", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_remark">Payment Remark</Label>
              <Input
                id="transaction_remark"
                placeholder="Optional payment note"
                value={formData.transaction_remark}
                onChange={(e) =>
                  updateField("transaction_remark", e.target.value)
                }
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Status</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Booking Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {bookingStatusOptions.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateField("booking_status", status.value)}
                    disabled={loading}
                    className={cn(
                      "relative p-3 rounded-lg border-2 text-center transition-all text-sm",
                      formData.booking_status === status.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      loading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {formData.booking_status === status.value && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn("w-3 h-3 rounded-full", status.color)}
                      />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {paymentStatusOptions.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateField("payment_status", status.value)}
                    disabled={loading}
                    className={cn(
                      "relative p-3 rounded-lg border-2 text-center transition-all text-sm",
                      formData.payment_status === status.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      loading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {formData.payment_status === status.value && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn("w-3 h-3 rounded-full", status.color)}
                      />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-secondary rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-lg">Booking Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">
                {formData.customer_name || "-"}
              </span>
            </div>
            {selectedPlot && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Party Plot:</span>
                <span className="font-medium">{selectedPlot.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event Date:</span>
              <span className="font-medium">
                {formData.event_date ? format(formData.event_date, "PPP") : "-"}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-semibold">
                ₹{Number(formData.price || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advance Paid:</span>
              <span className="font-semibold text-green-600">
                ₹{Number(formData.advance_amount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Remaining Amount:</span>
              <span className="font-bold text-primary text-lg">
                ₹{remainingAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/bookings")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="w-full shadow-primary-glow"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading
              ? "Processing..."
              : isEditMode
                ? "Update Booking"
                : "Create Booking"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      {showSuccessDialog && (
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
                backgroundColor: "#dcfce7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style={{ margin: "0 0 10px 0", color: "#16a34a" }}>Success!</h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>
              Booking {isEditMode ? "updated" : "created"} successfully!
            </p>
            <button
              onClick={handleSuccessDialogClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBooking;
