import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Users,
  IndianRupee,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const ViewPartyPlots = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();

  // Get server_url from localStorage
  const server_url = localStorage.getItem("server_url") || "/api/";
  const company_id = localStorage.getItem("company_id") || "1";

  const [partyPlots, setPartyPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPartyPlots();
  }, []);

  const fetchPartyPlots = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", "1"); // List type

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/party_plot.php`;

      const response = await axios.post(apiUrl, formData);

      if (response.data.status === "1" && response.data.result) {
        setPartyPlots(response.data.result);
        setMessage({ type: "", text: "" });
      } else {
        setPartyPlots([]);
        setMessage({
          type: "error",
          text: response.data.error || "No party plots found",
        });
      }
    } catch (error) {
      console.error("Error fetching party plots:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching party plots",
      });
      setPartyPlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlot) return;

    setDeleteLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", "4"); // Delete type
      formData.append("id", selectedPlot.id);

      const apiUrl = isDevelopment
        ? `${server_url}api_party_plot.php`
        : `${server_url}api_party_plot.php`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "1") {
        setMessage({
          type: "success",
          text: "Party plot deleted successfully",
        });
        setShowDeleteDialog(false);
        setSelectedPlot(null);
        fetchPartyPlots(); // Refresh list
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to delete party plot",
        });
      }
    } catch (error) {
      console.error("Error deleting party plot:", error);
      setMessage({
        type: "error",
        text: "An error occurred while deleting party plot",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (plot: any) => {
    setSelectedPlot(plot);
    setShowDeleteDialog(true);
  };

  const filteredPlots = partyPlots.filter((plot) => {
    const matchesSearch =
      !searchTerm ||
      plot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.plote_size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.rent?.includes(searchTerm);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPlots.length / ITEMS_PER_PAGE);
  const paginatedPlots = filteredPlots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "";

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Party Plots</h1>
          <p className="text-muted-foreground">
            Manage and view all your party plots
          </p>
        </div>
        <Link to="/add-party-plot/" className="hidden md:block">
          <Button className="shadow-primary-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Party Plot
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
            placeholder="Search by name, address, size, or rent..."
            className="flex h-10 w-full md:flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        Showing {paginatedPlots.length} of {filteredPlots.length} party plots
      </p>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading party plots...</p>
        </div>
      )}

      {/* Grid View */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPlots.map((plot) => (
            <div
              key={plot.id}
              className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-muted">
                {plot.images ? (
                  <img
                    src={plot.images}
                    alt={plot.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ₹{Number(plot.rent).toLocaleString()}/day
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg mb-1">{plot.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{plot.address}</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-3 text-sm">
                  {plot.plote_size && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Maximize2 className="w-4 h-4" />
                      <span>{plot.plote_size}</span>
                    </div>
                  )}
                  {plot.plote_peropel_size && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{plot.plote_peropel_size} people</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {plot.long_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plot.long_description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/add-party-plot/${plot.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(plot)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
      {!loading && filteredPlots.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No party plots found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Get started by adding your first party plot"}
          </p>
          {!hasActiveFilters && (
            <Link to="/add-party-plot/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Party Plot
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Mobile Add Button */}
      <Link to="/add-party-plot/" className="md:hidden fixed bottom-6 right-6">
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
              Delete Party Plot?
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>
              Are you sure you want to delete{" "}
              <strong>{selectedPlot?.name}</strong>? This action cannot be
              undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedPlot(null);
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

export default ViewPartyPlots;
