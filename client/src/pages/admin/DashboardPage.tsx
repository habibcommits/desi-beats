import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, List, ShoppingBag, TrendingUp } from "lucide-react";
import type { Category, MenuItem, Order } from "@shared/schema";

export default function AdminDashboardPage() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: List,
      description: "Active categories",
    },
    {
      title: "Menu Items",
      value: menuItems.length,
      icon: Package,
      description: "Items in menu",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      description: "All time orders",
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: TrendingUp,
      description: "Awaiting preparation",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your restaurant management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center border-b pb-2"
                    data-testid={`order-${order.id}`}
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryType === "delivery" ? "Delivery" : "Pickup"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rs. {order.totalAmount}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Featured Items
                </span>
                <span className="font-medium">
                  {menuItems.filter((item) => item.featured === 1).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Items
                </span>
                <span className="font-medium">
                  {menuItems.filter((item) => item.available === 1).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Preparing Orders
                </span>
                <span className="font-medium">
                  {orders.filter((o) => o.status === "preparing").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed Orders
                </span>
                <span className="font-medium">
                  {orders.filter((o) => o.status === "completed").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
