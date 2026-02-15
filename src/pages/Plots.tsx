import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plots = [
  {
    id: "1",
    name: "Grand Garden",
    tagline: "Where Dreams Come True",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80",
    capacity: 500,
    area: "12,000 sq.ft",
    pricePerDay: 50000,
    rating: 4.9,
    reviews: 127,
  },
  {
    id: "2",
    name: "Royal Lawn",
    tagline: "Elegance Redefined",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80",
    capacity: 300,
    area: "8,000 sq.ft",
    pricePerDay: 35000,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "3",
    name: "Celebration Hall",
    tagline: "Indoor Excellence",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&auto=format&fit=crop&q=80",
    capacity: 200,
    area: "5,000 sq.ft",
    pricePerDay: 25000,
    rating: 4.8,
    reviews: 65,
  },
];

const Plots = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Party Plots</h1>
          <p className="text-muted-foreground">
            Choose the perfect venue for your event
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot) => (
          <Link
            key={plot.id}
            to={`/plots/${plot.id}`}
            className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={plot.image}
                alt={plot.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-medium">{plot.rating}</span>
                <span className="text-muted-foreground">({plot.reviews})</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg">{plot.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{plot.tagline}</p>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{plot.capacity} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{plot.area}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-lg font-bold text-primary">
                    ₹{plot.pricePerDay.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Plots;