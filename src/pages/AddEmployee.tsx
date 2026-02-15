import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: 1, label: "Active", color: "bg-green-500" },
  { value: 0, label: "Inactive", color: "bg-red-500" },
];

const AddEmployee = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  // Get server_url from localStorage
  const server_url = localStorage.getItem("server_url") || "/api/";
  const company_id = localStorage.getItem("company_id") || "1";

  const [showPassword, setShowPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_mobile: "",
    employee_code: "",
    employee_password: "",
    employee_email: "",
    company_id: company_id,
    employee_status: 1,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setIsEditMode(true);
      fetchEmployeeDetails(id);
    }
  }, [id]);

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", "1"); // List type to get all employees

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`;

      const response = await axios.post(apiUrl, formDataToSend);

      if (response.data.status === "1" && response.data.result) {
        const employee = response.data.result.find(
          (emp: any) => emp.id === employeeId,
        );
        if (employee) {
          setFormData({
            employee_name: employee.employee_name || "",
            employee_mobile: employee.employee_mobile || "",
            employee_code: employee.employee_code || "",
            employee_password: "", // Don't populate password for security
            employee_email: employee.employee_email || "",
            company_id: employee.company_id || company_id,
            employee_status: parseInt(employee.employee_status) || 1,
          });
        }
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to fetch employee details",
        });
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching employee details",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee_name.trim()) {
      newErrors.employee_name = "Employee name is required";
    }

    if (!formData.employee_mobile.trim()) {
      newErrors.employee_mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.employee_mobile.replace(/\s+/g, ""))) {
      newErrors.employee_mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.employee_code.trim()) {
      newErrors.employee_code = "Employee code is required";
    }

    if (!isEditMode && !formData.employee_password.trim()) {
      newErrors.employee_password = "Password is required";
    }

    if (
      formData.employee_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.employee_email)
    ) {
      newErrors.employee_email = "Please enter a valid email address";
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
        submitData.append("type", "3"); // Update
        submitData.append("id", id!);
        submitData.append("employee_name", formData.employee_name);
        submitData.append("employee_mobile", formData.employee_mobile);
        submitData.append("employee_code", formData.employee_code);
        if (formData.employee_password) {
          submitData.append("employee_password", formData.employee_password);
        }
        submitData.append("employee_email", formData.employee_email);
        submitData.append("company_id", formData.company_id);
        submitData.append(
          "employee_status",
          formData.employee_status.toString(),
        );
      } else {
        submitData.append("type", "2"); // Add
        submitData.append("employee_name", formData.employee_name);
        submitData.append("employee_mobile", formData.employee_mobile);
        submitData.append("employee_code", formData.employee_code);
        submitData.append("employee_password", formData.employee_password);
        submitData.append("employee_email", formData.employee_email);
        submitData.append("company_id", formData.company_id);
        submitData.append(
          "employee_status",
          formData.employee_status.toString(),
        );
      }

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`;
      const response = await axios.post(apiUrl, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "1") {
        setShowSuccessDialog(true);
      } else {
        setMessage({
          type: "error",
          text:
            response.data.error ||
            `Failed to ${isEditMode ? "update" : "add"} employee`,
        });
      }
    } catch (error) {
      console.error("Error submitting employee:", error);
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditMode ? "updating" : "adding"} employee`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/employees");
  };

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: "", text: "" });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Employee" : "New Employee"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update employee information below"
            : "Fill in the details to add a new employee"}
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
        {/* Basic Details */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employee_name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employee_name"
                placeholder="Enter employee full name"
                value={formData.employee_name}
                onChange={(e) => updateField("employee_name", e.target.value)}
                className={errors.employee_name ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.employee_name && (
                <p className="text-sm text-red-500">{errors.employee_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_code">
                Employee Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employee_code"
                placeholder="e.g., EMP001"
                value={formData.employee_code}
                onChange={(e) => updateField("employee_code", e.target.value)}
                className={errors.employee_code ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.employee_code && (
                <p className="text-sm text-red-500">{errors.employee_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_mobile">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employee_mobile"
                type="tel"
                placeholder="9876543210"
                value={formData.employee_mobile}
                maxLength={10}
                onChange={(e) => updateField("employee_mobile", e.target.value)}
                className={errors.employee_mobile ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.employee_mobile && (
                <p className="text-sm text-red-500">{errors.employee_mobile}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employee_email">Email Address</Label>
              <Input
                id="employee_email"
                type="email"
                placeholder="employee@company.com"
                value={formData.employee_email}
                onChange={(e) => updateField("employee_email", e.target.value)}
                className={errors.employee_email ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.employee_email && (
                <p className="text-sm text-red-500">{errors.employee_email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Login Credentials</h2>

          <div className="space-y-2">
            <Label htmlFor="employee_password">
              Password {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Leave blank to keep current password)
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="employee_password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEditMode ? "Enter new password to change" : "Enter password"
                }
                value={formData.employee_password}
                onChange={(e) =>
                  updateField("employee_password", e.target.value)
                }
                className={
                  errors.employee_password ? "border-red-500 pr-10" : "pr-10"
                }
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
            {errors.employee_password && (
              <p className="text-sm text-red-500">{errors.employee_password}</p>
            )}
          </div>
        </div>

        {/* Company & Status */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Employee Status</h2>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateField("employee_status", status.value)}
                    disabled={loading}
                    className={cn(
                      "relative p-3 rounded-lg border-2 text-left transition-all",
                      formData.employee_status === status.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      loading && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {formData.employee_status === status.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("w-2 h-2 rounded-full", status.color)}
                      />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </button>
                ))}
              </div>
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
            onClick={() => navigate("/employees")}
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
                ? "Update Employee"
                : "Add Employee"}
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
              Employee {isEditMode ? "updated" : "added"} successfully!
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

export default AddEmployee;
