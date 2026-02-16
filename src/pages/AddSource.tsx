import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronLeft, Check } from "lucide-react";

const AddSource = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const company_id = localStorage.getItem("company_id") || "1";
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [formData, setFormData] = useState({
    company_id: company_id,
    source_name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setIsEditMode(true);
      fetchSourceDetails(id);
    }
  }, [id]);

  const fetchSourceDetails = async (sourceId: string) => {
    try {
      setFetchLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("type", "4");
      formDataToSend.append("company_id", company_id);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}source.php`,
        formDataToSend,
      );

      if (response.data.status === "1" && response.data.data) {
        const source = response.data.data.find(
          (s: any) => s.source_id === sourceId,
        );
        if (source) {
          setFormData({
            company_id: company_id,
            source_name: source.source_name || "",
          });
        } else {
          setMessage({ type: "error", text: "Source not found" });
        }
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to fetch source details",
        });
      }
    } catch (error) {
      console.error("Error fetching source details:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching source details",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.source_name.trim()) {
      newErrors.source_name = "Source name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      submitData.append("type", isEditMode ? "2" : "1");
      submitData.append("company_id", formData.company_id);
      submitData.append("source_name", formData.source_name.trim());
      if (isEditMode && id) {
        submitData.append("source_id", id);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}source.php`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.status === "1") {
        setShowSuccessDialog(true);
      } else {
        setMessage({
          type: "error",
          text:
            response.data.error ||
            `Failed to ${isEditMode ? "update" : "add"} source`,
        });
      }
    } catch (error) {
      console.error("Error submitting source:", error);
      setMessage({
        type: "error",
        text: `An error occurred while ${isEditMode ? "updating" : "adding"} source`,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
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

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Source" : "New Source"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditMode
              ? "Update source information below"
              : "Fill in the details to add a new source"}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {message.text && (
        <div
          className={cn(
            "p-4 mb-6 rounded-lg border text-sm",
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800",
          )}
        >
          {message.text}
        </div>
      )}

      {/* Fetch Loading */}
      {fetchLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-muted-foreground text-sm">
            Loading source details...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Card */}
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>
            <div className="space-y-2">
              <Label htmlFor="source_name">
                Source Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="source_name"
                placeholder="e.g. Google, Referral, Walk-in..."
                value={formData.source_name}
                onChange={(e) => updateField("source_name", e.target.value)}
                className={
                  errors.source_name
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={loading}
                autoFocus={!isEditMode}
              />
              {errors.source_name && (
                <p className="text-sm text-red-500">{errors.source_name}</p>
              )}
            </div>
          </div>

          {/* ── Action Buttons — inline in flow, sits above navbar naturally ── */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/view-sources")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 shadow-primary-glow"
              disabled={loading || fetchLoading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </span>
              ) : isEditMode ? (
                "Update Source"
              ) : (
                "Add Source"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* ── Success Dialog ─────────────────────────────────────────────────── */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-green-600" strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-green-700">Success!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Source {isEditMode ? "updated" : "added"} successfully!
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/view-sources");
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSource;
