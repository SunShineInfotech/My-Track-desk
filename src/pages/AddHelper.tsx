import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Check } from "lucide-react";
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
import { cn } from "@/lib/utils";

const helperTypes = [
  { value: 1, label: "Decoration", icon: "🎉" },
  { value: 2, label: "Catering", icon: "🍽️" },
];

const AddHelper = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  // Get server_url from localStorage
  const server_url = localStorage.getItem("server_url") || "/api/";
  const company_id = localStorage.getItem("company_id") || "1";

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 1,
    name: "",
    whatsapp_number: "",
    number_2: "",
    email: "",
    address: "",
    remark: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setIsEditMode(true);
      fetchHelperDetails(id);
    }
  }, [id]);

  const fetchHelperDetails = async (helperId: string) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", "1"); // List type to get all helpers

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/helper.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/helper.php`;

      const response = await axios.post(apiUrl, formDataToSend);

      if (response.data.status === "1" && response.data.result) {
        const helper = response.data.result.find(
          (hlp: any) => hlp.id === helperId,
        );
        if (helper) {
          setFormData({
            type: parseInt(helper.type) || 1,
            name: helper.name || "",
            whatsapp_number: helper.whatsapp_number || "",
            number_2: helper.number_2 || "",
            email: helper.email || "",
            address: helper.address || "",
            remark: helper.remark || "",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to fetch helper details",
        });
      }
    } catch (error) {
      console.error("Error fetching helper details:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching helper details",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.whatsapp_number.trim()) {
      newErrors.whatsapp_number = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsapp_number.replace(/\s+/g, ""))) {
      newErrors.whatsapp_number = "Please enter a valid 10-digit mobile number";
    }

    if (
      formData.number_2 &&
      !/^\d{10}$/.test(formData.number_2.replace(/\s+/g, ""))
    ) {
      newErrors.number_2 = "Please enter a valid 10-digit mobile number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
      } else {
        submitData.append("type", "2"); // Add
      }

      submitData.append("helper_type", formData.type.toString());
      submitData.append("name", formData.name);
      submitData.append("whatsapp_number", formData.whatsapp_number);
      submitData.append("number_2", formData.number_2);
      submitData.append("email", formData.email);
      submitData.append("address", formData.address);
      submitData.append("remark", formData.remark);

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/helper.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/helper.php`;

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
            `Failed to ${isEditMode ? "update" : "add"} helper`,
        });
      }
    } catch (error) {
      console.error("Error submitting helper:", error);
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditMode ? "updating" : "adding"} helper`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/view-helpers");
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

  const selectedType = helperTypes.find((type) => type.value === formData.type);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Helper" : "New Helper"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update helper information below"
            : "Fill in the details to add a new helper"}
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
        {/* Helper Type Selection */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Helper Type</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {helperTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateField("type", type.value)}
                disabled={loading}
                className={cn(
                  "relative p-4 rounded-lg border-2 text-center transition-all",
                  formData.type === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  loading && "opacity-50 cursor-not-allowed",
                )}
              >
                {formData.type === type.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="text-3xl mb-2">{type.icon}</div>
                <span className="font-medium text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter helper full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">
                WhatsApp Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="whatsapp_number"
                type="tel"
                placeholder="9876543210"
                value={formData.whatsapp_number}
                maxLength={10}
                onChange={(e) => updateField("whatsapp_number", e.target.value)}
                className={errors.whatsapp_number ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.whatsapp_number && (
                <p className="text-sm text-red-500">{errors.whatsapp_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_2">Alternate Number</Label>
              <Input
                id="number_2"
                type="tel"
                placeholder="9876543210"
                value={formData.number_2}
                maxLength={10}
                onChange={(e) => updateField("number_2", e.target.value)}
                className={errors.number_2 ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.number_2 && (
                <p className="text-sm text-red-500">{errors.number_2}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="helper@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address & Remarks */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Additional Information</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address..."
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                disabled={loading}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">Remarks / Notes</Label>
              <Textarea
                id="remark"
                placeholder="Any additional notes or remarks..."
                value={formData.remark}
                onChange={(e) => updateField("remark", e.target.value)}
                disabled={loading}
                rows={3}
                className="resize-none"
              />
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
            onClick={() => navigate("/view-helpers")}
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
                ? "Update Helper"
                : "Add Helper"}
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
              Helper {isEditMode ? "updated" : "added"} successfully!
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

export default AddHelper;
