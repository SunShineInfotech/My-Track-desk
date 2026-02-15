import { Calendar, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingBookingCard } from "@/components/dashboard/UpcomingBookingCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingsChart } from "@/components/dashboard/BookingsChart";

// Mock data for upcoming bookings
const upcomingBookings = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    eventType: "Wedding Reception",
    date: "Feb 8, 2026",
    time: "6:00 PM",
    plotName: "Grand Garden",
    guests: 350,
    status: "confirmed" as const,
  },
  {
    id: "2",
    customerName: "Priya Patel",
    eventType: "Birthday Party",
    date: "Feb 10, 2026",
    time: "4:00 PM",
    plotName: "Royal Lawn",
    guests: 120,
    status: "pending" as const,
  },
  {
    id: "3",
    customerName: "Amit Kumar",
    eventType: "Corporate Event",
    date: "Feb 12, 2026",
    time: "10:00 AM",
    plotName: "Celebration Hall",
    guests: 200,
    status: "confirmed" as const,
  },
  {
    id: "4",
    customerName: "Neha Gupta",
    eventType: "Engagement Ceremony",
    date: "Feb 14, 2026",
    time: "7:00 PM",
    plotName: "Grand Garden",
    guests: 180,
    status: "pending" as const,
  },
];

const Index = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your bookings today.
          </p>
        </div>
        <Link to="/add-booking" className="hidden md:block">
          <Button className="shadow-primary-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value="156"
          subtitle="All time"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Today's Bookings"
          value="4"
          subtitle="Scheduled events"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Total Revenue"
          value="₹4.2L"
          subtitle="This month"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatsCard
          title="Total Customers"
          value="89"
          subtitle="Unique customers"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          variant="warning"
        />
      </div>

      {/* Charts Section - Desktop Only */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </div>
          <Link to="/bookings">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingBookings.map((booking) => (
            <UpcomingBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
