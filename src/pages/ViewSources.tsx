import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Tag,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

interface Source {
  source_id: string;
  source_name: string;
  c_date: string;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

// Only kept for Delete — no more Add/Edit dialog
const Dialog = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div
      className="bg-background rounded-xl shadow-xl w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const ViewSources = () => {
  const navigate = useNavigate();
  const company_id = localStorage.getItem("company_id") || "1";
  const API_URL = `${import.meta.env.VITE_API_URL}source.php`;

  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Delete dialog only
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", "4");
      formData.append("company_id", company_id);

      const response = await axios.post(API_URL, formData);

      if (response.data.status === "1") {
        setSources(response.data.data || []);
        setMessage({ type: "", text: "" });
      } else {
        setSources([]);
        setMessage({
          type: "error",
          text: response.data.error || "No sources found",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch sources" });
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSource) return;
    setDeleteLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", "3");
      formData.append("company_id", company_id);
      formData.append("source_id", selectedSource.source_id);

      const response = await axios.post(API_URL, formData);

      if (response.data.status === "1") {
        setMessage({ type: "success", text: "Source deleted successfully" });
        setShowDeleteDialog(false);
        setSelectedSource(null);
        fetchSources();
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to delete source",
        });
        setShowDeleteDialog(false);
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting" });
      setShowDeleteDialog(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (source: Source) => {
    setSelectedSource(source);
    setShowDeleteDialog(true);
  };

  const filteredSources = sources.filter(
    (s) =>
      !searchTerm ||
      s.source_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSources.length / ITEMS_PER_PAGE);
  const paginatedSources = filteredSources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = !!searchTerm;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sources</h1>
          <p className="text-muted-foreground">
            Manage lead and enquiry sources
          </p>
        </div>
        {/* Desktop: New Source button → navigate to add-source page */}
        <Button className="md:hidden" onClick={() => navigate("/add-source")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
        <Button
          className="hidden md:flex shadow-primary-glow"
          onClick={() => navigate("/add-source")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Source
        </Button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={cn(
            "p-4 rounded-lg border flex items-start justify-between gap-2",
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800",
          )}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <X className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            className="opacity-60 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
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
          <input
            type="text"
            placeholder="Search by source name..."
            className="flex h-10 w-full md:flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
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
        Showing {paginatedSources.length} of {filteredSources.length} sources
      </p>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading sources...</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden md:block bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground w-12">
                  #
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Source Name
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Created On
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSources.map((source, index) => (
                <tr
                  key={source.source_id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4 text-sm text-muted-foreground">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{source.source_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(source.c_date)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {/* Navigate to edit page */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/add-source/${source.source_id}`)
                        }
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(source)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {paginatedSources.map((source, index) => (
            <div
              key={source.source_id}
              className="bg-card rounded-xl p-4 shadow-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{source.source_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(source.c_date)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                {/* Navigate to edit page */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/add-source/${source.source_id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(source)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
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
      {!loading && filteredSources.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No sources found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Try adjusting your search"
              : "Get started by adding your first source"}
          </p>
          {!hasActiveFilters && (
            <Button onClick={() => navigate("/add-source")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Source
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog onClose={() => setShowDeleteDialog(false)}>
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-destructive">
                Delete Source?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Are you sure you want to delete{" "}
                <strong className="text-foreground">
                  "{selectedSource?.source_name}"
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedSource(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ViewSources;
