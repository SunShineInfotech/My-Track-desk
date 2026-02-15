import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", bookings: 12 },
  { month: "Feb", bookings: 19 },
  { month: "Mar", bookings: 15 },
  { month: "Apr", bookings: 22 },
  { month: "May", bookings: 18 },
  { month: "Jun", bookings: 25 },
  { month: "Jul", bookings: 28 },
];

export function BookingsChart() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-semibold">Monthly Bookings</h3>
        <p className="text-sm text-muted-foreground">Booking count by month</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 32%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [value, "Bookings"]}
            />
            <Bar
              dataKey="bookings"
              fill="hsl(214, 89%, 52%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}