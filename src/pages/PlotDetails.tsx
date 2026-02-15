import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Wifi,
  Car,
  UtensilsCrossed,
  Music,
  Camera,
  Sparkles,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock plot data
const plotData = {
  id: "1",
  name: "Grand Garden",
  tagline: "Where Dreams Come True",
  description:
    "Experience the magic of outdoor celebrations at Grand Garden, our premium party plot featuring lush green lawns, elegant décor options, and world-class amenities. Perfect for weddings, receptions, and grand celebrations.",
  images: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1200&auto=format&fit=crop&q=80",
  ],
  capacity: 500,
  area: "12,000 sq.ft",
  pricePerDay: 50000,
  amenities: [
    { icon: Wifi, label: "Free Wi-Fi" },
    { icon: Car, label: "Parking (200+)" },
    { icon: UtensilsCrossed, label: "Kitchen" },
    { icon: Music, label: "Sound System" },
    { icon: Camera, label: "Photo Zones" },
    { icon: Sparkles, label: "Décor Options" },
  ],
  contact: {
    phone: "+91 98765 43210",
    email: "bookings@partyplot.com",
    address: "123 Celebration Road, Event City, Gujarat 380001",
  },
  availability: "Mon-Sun: 8 AM - 12 AM",
};

const PlotDetails = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % plotData.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + plotData.images.length) % plotData.images.length
    );
  };

  return (
    <div className="min-h-screen">
      {/* Image Gallery */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-muted overflow-hidden">
        <img
          src={plotData.images[currentImage]}
          alt={`${plotData.name} - Image ${currentImage + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {plotData.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentImage
                  ? "bg-primary-foreground w-6"
                  : "bg-primary-foreground/50 hover:bg-primary-foreground/75"
              )}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto -mt-16 relative z-10 space-y-6">
        {/* Header Card */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{plotData.name}</h1>
              <p className="text-muted-foreground">{plotData.tagline}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary">
                ₹{plotData.pricePerDay.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">per day</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span>Up to {plotData.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{plotData.area}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>{plotData.availability}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-lg mb-3">About This Venue</h2>
          <p className="text-muted-foreground leading-relaxed">
            {plotData.description}
          </p>
        </div>

        {/* Amenities */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plotData.amenities.map((amenity) => (
              <div
                key={amenity.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <amenity.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Contact Us</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{plotData.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{plotData.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{plotData.contact.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="sticky bottom-20 md:bottom-4 z-20">
          <Link to="/add-booking">
            <Button size="lg" className="w-full shadow-primary-glow">
              Book This Venue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlotDetails;