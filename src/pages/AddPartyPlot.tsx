import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Trash, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AddPartyPlot = () => {
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
    name: "",
    address: "",
    plote_size: "",
    plote_peropel_size: "",
    rent: "",
    images: null,
    long_description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setIsEditMode(true);
      fetchPartyPlotDetails(id);
    }
  }, [id]);

  const fetchPartyPlotDetails = async (plotId: string) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", "1"); // List type to get all party plots

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`;

      const response = await axios.post(apiUrl, formDataToSend);

      if (response.data.status === "1" && response.data.result) {
        const plot = response.data.result.find((plt: any) => plt.id === plotId);
        if (plot) {
          setFormData({
            name: plot.name || "",
            address: plot.address || "",
            plote_size: plot.plote_size || "",
            plote_peropel_size: plot.plote_peropel_size || "",
            rent: plot.rent || "",
            images: plot.images || null,
            long_description: plot.long_description || "",
          });
          if (plot.images) {
            setImagePreview(plot.images);
          }
        }
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to fetch party plot details",
        });
      }
    } catch (error) {
      console.error("Error fetching party plot details:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching party plot details",
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    if (field === "images") {
      const file = value.target.files[0];
      if (file) {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          setMessage({
            type: "error",
            text: "Please upload a valid image file (JPG, PNG, GIF, WEBP)",
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setMessage({
            type: "error",
            text: "Image size should be less than 5MB",
          });
          return;
        }
        setFormData((prev) => ({ ...prev, images: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

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

  const removeImage = () => {
    setFormData({ ...formData, images: null });
    setImagePreview(null);
    const fileInput = document.getElementById(
      "plot_image_input",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Party plot name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.rent.trim()) {
      newErrors.rent = "Rent amount is required";
    } else if (isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) {
      newErrors.rent = "Please enter a valid rent amount";
    }

    if (!isEditMode && !formData.images) {
      newErrors.images = "Please upload at least one image";
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

      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("plote_size", formData.plote_size);
      submitData.append("plote_peropel_size", formData.plote_peropel_size);
      submitData.append("rent", formData.rent);
      submitData.append("long_description", formData.long_description);

      if (formData.images && formData.images instanceof File) {
        submitData.append("images", formData.images);
      }

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`;

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
            `Failed to ${isEditMode ? "update" : "add"} party plot`,
        });
      }
    } catch (error) {
      console.error("Error submitting party plot:", error);
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditMode ? "updating" : "adding"} party plot`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/view-party-plots");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Party Plot" : "New Party Plot"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update party plot information below"
            : "Fill in the details to add a new party plot"}
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

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Party Plot Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Grand Garden, Royal Lawn"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="Enter complete address with landmarks..."
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                disabled={loading}
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Plot Specifications */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Plot Specifications</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plote_size">Plot Size</Label>
              <Input
                id="plote_size"
                placeholder="e.g., 5000 sq ft"
                value={formData.plote_size}
                onChange={(e) => handleChange("plote_size", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plote_peropel_size">Capacity (People)</Label>
              <Input
                id="plote_peropel_size"
                type="number"
                placeholder="e.g., 500"
                value={formData.plote_peropel_size}
                onChange={(e) =>
                  handleChange("plote_peropel_size", e.target.value)
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rent">
                Rent (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rent"
                type="number"
                placeholder="Enter rent amount per day"
                value={formData.rent}
                onChange={(e) => handleChange("rent", e.target.value)}
                className={errors.rent ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.rent && (
                <p className="text-sm text-red-500">{errors.rent}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Plot Images</h2>

          <div className="space-y-2">
            <Label htmlFor="plot_image_input">
              Upload Image{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="file"
              id="plot_image_input"
              accept="image/*"
              onChange={(e) => handleChange("images", e)}
              disabled={loading}
              className={errors.images ? "border-red-500" : ""}
            />
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Accepted formats: JPG, PNG, GIF, WEBP (Max size: 5MB)
            </p>
          </div>

          {imagePreview && (
            <div className="relative p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium">Image Preview</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  disabled={loading}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <img
                src={imagePreview}
                alt="Plot Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-lg">Description</h2>

          <div className="space-y-2">
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              placeholder="Describe amenities, facilities, parking, catering options, etc..."
              value={formData.long_description}
              onChange={(e) => handleChange("long_description", e.target.value)}
              disabled={loading}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Include details about facilities, parking, catering, decorations,
              etc.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/view-party-plots")}
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
                ? "Update Party Plot"
                : "Add Party Plot"}
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
              Party Plot {isEditMode ? "updated" : "added"} successfully!
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

export default AddPartyPlot;
