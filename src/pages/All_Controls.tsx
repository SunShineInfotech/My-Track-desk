import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Check,
  Eye,
  EyeOff,
  CalendarIcon,
  MoreVertical,
  Copy,
  Trash2,
  RotateCcw,
  User,
} from "lucide-react";
import { format } from "date-fns";

// ── shadcn/ui imports ──────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────
const COMPANY_OPTIONS = [
  { value: "1", label: "Sunshine Products Pvt. Ltd." },
  { value: "2", label: "Trackdesk Solutions" },
  { value: "3", label: "Head Office" },
];

const DEPARTMENT_OPTIONS = [
  { value: "sales", label: "Sales" },
  { value: "ops", label: "Operations" },
  { value: "tech", label: "Tech" },
  { value: "hr", label: "HR" },
];

// Permissions — rendered as individual Checkboxes
const PERMISSION_OPTIONS = [
  { id: "can_view_reports", label: "View Reports" },
  { id: "can_edit_orders", label: "Edit Orders" },
  { id: "can_manage_clients", label: "Manage Clients" },
  { id: "can_export_data", label: "Export Data" },
];

// Shift preference — rendered as standalone Toggle buttons (single-select)
const SHIFT_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "night", label: "Night" },
  { value: "flexible", label: "Flexible" },
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormValues {
  employee_name: string;
  employee_mobile: string;
  employee_code: string;
  employee_password: string;
  employee_email: string;
  company_id: string;
  employee_status: "1" | "0";
  department: string;
  joining_date: Date | undefined;
  notes: string;
  send_welcome_email: boolean;
  confirm_details: boolean;
  // Permissions checkboxes
  can_view_reports: boolean;
  can_edit_orders: boolean;
  can_manage_clients: boolean;
  can_export_data: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────
const AddSource = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const company_id = localStorage.getItem("company_id") || "1";

  const [showPassword, setShowPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Shift preference — local state (Toggle is not a form input)
  const [shiftPreference, setShiftPreference] = useState<string>("morning");

  // ── react-hook-form ─────────────────────────────────────────────────────────
  const form = useForm<FormValues>({
    defaultValues: {
      employee_name: "",
      employee_mobile: "",
      employee_code: "",
      employee_password: "",
      employee_email: "",
      company_id: company_id,
      employee_status: "1",
      department: "sales",
      joining_date: undefined,
      notes: "",
      send_welcome_email: false,
      confirm_details: false,
      can_view_reports: false,
      can_edit_orders: false,
      can_manage_clients: false,
      can_export_data: false,
    },
  });

  const { watch, reset } = form;
  const confirmDetails = watch("confirm_details");
  const employeeCode = watch("employee_code");

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setIsEditMode(true);
      fetchEmployeeDetails(id);
    }
  }, [id]);

  // ── API: fetch ──────────────────────────────────────────────────────────────
  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const fd = new FormData();
      fd.append("type", "1");
      const response = await axios.post(
        `https://sunshineproduct.in/trackdesk/api/employee.php`,
        fd,
      );
      if (response.data.status === "1" && response.data.result) {
        const emp = response.data.result.find((e: any) => e.id === employeeId);
        if (emp) {
          reset({
            employee_name: emp.employee_name || "",
            employee_mobile: emp.employee_mobile || "",
            employee_code: emp.employee_code || "",
            employee_password: "",
            employee_email: emp.employee_email || "",
            company_id: emp.company_id || company_id,
            employee_status: emp.employee_status === "0" ? "0" : "1",
            department: emp.department || "sales",
            joining_date: emp.joining_date
              ? new Date(emp.joining_date)
              : undefined,
            notes: emp.notes || "",
            send_welcome_email: false,
            confirm_details: false,
            can_view_reports: !!emp.can_view_reports,
            can_edit_orders: !!emp.can_edit_orders,
            can_manage_clients: !!emp.can_manage_clients,
            can_export_data: !!emp.can_export_data,
          });
          setShiftPreference(emp.shift_preference || "morning");
        }
      } else {
        setErrorMessage(
          response.data.error || "Failed to fetch employee details",
        );
      }
    } catch {
      setErrorMessage("An error occurred while fetching employee details");
    }
  };

  // ── API: submit ─────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    if (!data.confirm_details) {
      setErrorMessage(
        "Please confirm that the details are correct before submitting.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const fd = new FormData();
      fd.append("type", isEditMode ? "3" : "2");
      if (isEditMode && id) fd.append("id", id);
      fd.append("employee_name", data.employee_name);
      fd.append("employee_mobile", data.employee_mobile);
      fd.append("employee_code", data.employee_code);
      if (!isEditMode || data.employee_password) {
        fd.append("employee_password", data.employee_password);
      }
      fd.append("employee_email", data.employee_email);
      fd.append("company_id", data.company_id);
      fd.append("employee_status", data.employee_status);
      fd.append("department", data.department);
      fd.append("notes", data.notes);
      fd.append("shift_preference", shiftPreference);
      fd.append("can_view_reports", data.can_view_reports ? "1" : "0");
      fd.append("can_edit_orders", data.can_edit_orders ? "1" : "0");
      fd.append("can_manage_clients", data.can_manage_clients ? "1" : "0");
      fd.append("can_export_data", data.can_export_data ? "1" : "0");
      fd.append("send_welcome_email", data.send_welcome_email ? "1" : "0");
      if (data.joining_date) {
        fd.append("joining_date", format(data.joining_date, "yyyy-MM-dd"));
      }

      const response = await axios.post(
        `https://sunshineproduct.in/trackdesk/api/employee.php`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.status === "1") {
        setShowSuccessDialog(true);
      } else {
        setErrorMessage(
          response.data.error ||
            `Failed to ${isEditMode ? "update" : "add"} employee`,
        );
      }
    } catch {
      setErrorMessage(
        `An error occurred while ${isEditMode ? "updating" : "adding"} employee`,
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate("/employees");
  };

  const handleReset = () => {
    reset();
    setShiftPreference("morning");
    setErrorMessage("");
  };

  const handleCopyCode = () => {
    if (employeeCode) navigator.clipboard.writeText(employeeCode);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Employee" : "New Employee"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEditMode
              ? "Update employee information below"
              : "Fill in the details to add a new employee"}
          </p>
        </div>

        {/* ── DropdownMenu — More Actions ──────────────────────────────────── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopyCode} disabled={!employeeCode}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Employee Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDrawerOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Open in Drawer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReset} className="text-orange-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Form
            </DropdownMenuItem>
            {isEditMode && (
              <DropdownMenuItem
                onClick={() => navigate("/employees")}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Discard Changes
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Error banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 1 · Basic Information
          ────────────────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="employee_name"
                  rules={{ required: "Employee name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter employee full name"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employee Code */}
              <FormField
                control={form.control}
                name="employee_code"
                rules={{ required: "Employee code is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employee Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., EMP001"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile */}
              <FormField
                control={form.control}
                name="employee_mobile"
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="employee_email"
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="employee@company.com"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes / Address — Textarea */}
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes / Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes, address, or remarks…"
                          className="min-h-[90px] resize-none"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional — visible only to admins.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 2 · Organisation
          ────────────────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-lg">Organisation</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Company — Select */}
              <FormField
                control={form.control}
                name="company_id"
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Company <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMPANY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Joining Date — Calendar */}
              <FormField
                control={form.control}
                name="joining_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        onClick={() => setShowCalendar((v) => !v)}
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "dd MMM yyyy")
                          : "Pick a date"}
                      </Button>
                      {showCalendar && (
                        <div className="absolute z-10 mt-1 rounded-md border bg-popover shadow-lg">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setShowCalendar(false);
                            }}
                            initialFocus
                            disabled={(d) => d > new Date()}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Department — ToggleGroup (single-select, uses toggle-group.tsx) */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(v) => {
                        if (v) field.onChange(v);
                      }}
                      variant="outline"
                      className="justify-start flex-wrap gap-2"
                      disabled={loading}
                    >
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <ToggleGroupItem
                          key={d.value}
                          value={d.value}
                          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                          {d.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shift Preference — standalone Toggle (uses toggle.tsx, pressed state) */}
            <div className="space-y-2">
              <Label>Shift Preference</Label>
              <div className="flex flex-wrap gap-2">
                {SHIFT_OPTIONS.map((shift) => (
                  <Toggle
                    key={shift.value}
                    variant="outline"
                    pressed={shiftPreference === shift.value}
                    onPressedChange={() => setShiftPreference(shift.value)}
                    disabled={loading}
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                  >
                    {shift.label}
                  </Toggle>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Select the preferred working shift for this employee.
              </p>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 3 · Access Permissions — Checkboxes
          ────────────────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <div>
              <h2 className="font-semibold text-lg">Access Permissions</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Select what this employee is allowed to do in the system.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERMISSION_OPTIONS.map((perm) => (
                <FormField
                  key={perm.id}
                  control={form.control}
                  name={perm.id as keyof FormValues}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors cursor-pointer">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                          id={perm.id}
                        />
                      </FormControl>
                      <Label
                        htmlFor={perm.id}
                        className="cursor-pointer text-sm font-medium leading-none"
                      >
                        {perm.label}
                      </Label>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 4 · Login Credentials
          ────────────────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-lg">Login Credentials</h2>

            {/* Password */}
            <FormField
              control={form.control}
              name="employee_password"
              rules={!isEditMode ? { required: "Password is required" } : {}}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password{" "}
                    {!isEditMode && <span className="text-red-500">*</span>}
                    {isEditMode && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Leave blank to keep current)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isEditMode
                            ? "Enter new password to change"
                            : "Enter password"
                        }
                        className="pr-10"
                        disabled={loading}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send Welcome Email — Switch */}
            <FormField
              control={form.control}
              name="send_welcome_email"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div>
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Send Welcome Email
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Notify the employee with login instructions via email.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading || !watch("employee_email")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 5 · Employee Status — RadioGroup
          ────────────────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-lg">Employee Status</h2>

            <FormField
              control={form.control}
              name="employee_status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-3"
                      disabled={loading}
                    >
                      {/* Active */}
                      <label
                        htmlFor="status-active"
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all",
                          field.value === "1"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <RadioGroupItem value="1" id="status-active" />
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="font-medium text-sm">Active</span>
                        </div>
                        {field.value === "1" && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </label>

                      {/* Inactive */}
                      <label
                        htmlFor="status-inactive"
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all",
                          field.value === "0"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <RadioGroupItem value="0" id="status-inactive" />
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="font-medium text-sm">Inactive</span>
                        </div>
                        {field.value === "0" && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ── Confirm Details — Checkbox ────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="confirm_details"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-lg border p-4 bg-muted/30">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                    id="confirm-details"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="confirm-details"
                    className="cursor-pointer text-sm font-medium"
                  >
                    I confirm all the details are correct
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone without manually editing the
                    record.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* ── Action Buttons ────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/employees")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 shadow-primary-glow"
              disabled={loading || !confirmDetails}
            >
              {loading
                ? "Processing…"
                : isEditMode
                  ? "Update Employee"
                  : "Add Employee"}
            </Button>
          </div>
        </form>
      </Form>

      {/* ── Success Dialog ───────────────────────────────────────────────────── */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <DialogTitle className="text-center text-green-700">
              Success!
            </DialogTitle>
            <DialogDescription className="text-center">
              Employee {isEditMode ? "updated" : "added"} successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleSuccessClose} className="w-full mt-2">
              Go to Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Drawer — Summary panel (mobile-friendly) ─────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {isEditMode ? "Edit Employee" : "New Employee"}
            </DrawerTitle>
            <DrawerDescription>
              Review your entries before submitting.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="px-4 flex-1 max-h-[60vh]">
            <div className="py-4 space-y-2 text-sm">
              {[
                { label: "Name", value: watch("employee_name") || "—" },
                { label: "Code", value: watch("employee_code") || "—" },
                { label: "Mobile", value: watch("employee_mobile") || "—" },
                { label: "Email", value: watch("employee_email") || "—" },
                { label: "Department", value: watch("department") || "—" },
                { label: "Shift", value: shiftPreference },
                {
                  label: "Status",
                  value:
                    watch("employee_status") === "1" ? "Active" : "Inactive",
                },
                {
                  label: "Joining Date",
                  value: watch("joining_date")
                    ? format(watch("joining_date")!, "dd MMM yyyy")
                    : "—",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium capitalize">{row.value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddSource;
