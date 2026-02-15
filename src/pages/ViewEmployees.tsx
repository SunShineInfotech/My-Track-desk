import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusStyles = {
  1: "bg-success/10 text-success",
  0: "bg-destructive/10 text-destructive",
};

const ITEMS_PER_PAGE = 10;

const ViewEmployees = () => {
  const isDevelopment = import.meta.env.DEV;
  const navigate = useNavigate();

  // Get server_url from localStorage
  const server_url = localStorage.getItem("server_url") || "/api/";
  const company_id = localStorage.getItem("company_id") || "1";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("type", "1"); // List type

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`;

      const response = await axios.post(apiUrl, formData);

      if (response.data.status === "1" && response.data.result) {
        setEmployees(response.data.result);
        setMessage({ type: "", text: "" });
      } else {
        setEmployees([]);
        setMessage({
          type: "error",
          text: response.data.error || "No employees found",
        });
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setMessage({
        type: "error",
        text: "An error occurred while fetching employees",
      });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    setDeleteLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", "4"); // Delete type
      formData.append("id", selectedEmployee.id);

      const apiUrl = isDevelopment
        ? `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`
        : `https://sunshineproduct.in/party_plote_booking_system/api/employee.php`;
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "1") {
        setMessage({
          type: "success",
          text: "Employee deleted successfully",
        });
        setShowDeleteDialog(false);
        setSelectedEmployee(null);
        fetchEmployees(); // Refresh list
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Failed to delete employee",
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setMessage({
        type: "error",
        text: "An error occurred while deleting employee",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesStatus =
      statusFilter === "all" ||
      employee.employee_status === parseInt(statusFilter);
    const matchesSearch =
      !searchTerm ||
      employee.employee_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.employee_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.employee_mobile?.includes(searchTerm) ||
      employee.employee_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== "all" || searchTerm;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Employees</h1>
          <p className="text-muted-foreground">
            Manage and view all your employees
          </p>
        </div>
        <Link to="/add-employee" className="hidden md:block">
          <Button className="shadow-primary-glow">
            <UserPlus className="w-4 h-4 mr-2" />
            New Employee
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
            placeholder="Search by name, code, mobile, or email..."
            className="flex h-10 w-full md:flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
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
        Showing {paginatedEmployees.length} of {filteredEmployees.length}{" "}
        employees
      </p>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading employees...</p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <div className="hidden md:block bg-card rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Employee Code
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Email
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
              {paginatedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-sm">
                      {employee.employee_code}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{employee.employee_name}</p>
                  </td>
                  <td className="p-4 text-sm">{employee.employee_mobile}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {employee.employee_email || "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                        statusStyles[
                          employee.employee_status as keyof typeof statusStyles
                        ],
                      )}
                    >
                      {employee.employee_status == 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/add-employee/${employee.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(employee)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
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
          {paginatedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-card rounded-xl p-4 shadow-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{employee.employee_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.employee_code}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                    statusStyles[
                      employee.employee_status as keyof typeof statusStyles
                    ],
                  )}
                >
                  {employee.employee_status === 1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{employee.employee_mobile}</span>
                </div>
                {employee.employee_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.employee_email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/add-employee/${employee.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(employee)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
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
      {!loading && filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No employees found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Get started by adding your first employee"}
          </p>
          {!hasActiveFilters && (
            <Link to="/add-employee">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Mobile Add Button */}
      <Link to="/add-employee" className="md:hidden fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-lg h-14 w-14 p-0">
          <UserPlus className="w-6 h-6" />
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
              Delete Employee?
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>
              Are you sure you want to delete{" "}
              <strong>{selectedEmployee?.employee_name}</strong>? This action
              cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedEmployee(null);
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

export default ViewEmployees;
