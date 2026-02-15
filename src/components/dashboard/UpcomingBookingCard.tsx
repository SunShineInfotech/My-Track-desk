import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";

interface UpcomingBookingCardProps {
  booking: {
    id: string;
    customerName: string;
    eventType: string;
    date: string;
    time: string;
    plotName: string;
    guests: number;
    status: "confirmed" | "pending" | "cancelled";
  };
}

const statusStyles = {
  confirmed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-destructive/10 text-destructive",
};

export function UpcomingBookingCard({ booking }: UpcomingBookingCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{booking.customerName}</h3>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0",
                statusStyles[booking.status]
              )}
            >
              {booking.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{booking.eventType}</p>
          
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{booking.date}</span>
              <span className="text-foreground font-medium">{booking.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{booking.plotName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{booking.guests} guests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}