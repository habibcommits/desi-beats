import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Phone, MapPin, Clock } from "lucide-react";
import type { Order, CartItem } from "@shared/schema";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const orderId = params?.id;

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find this order. Please check your order number.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderItems: CartItem[] = JSON.parse(order.items);

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We'll start preparing it right away.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <Badge variant="secondary" data-testid="badge-order-status">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Order Number</p>
                <p className="font-semibold" data-testid="text-order-id">#{order.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Order Time</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm">{order.customerPhone}</p>
                </div>
              </div>

              {order.deliveryType === "delivery" && order.customerAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{order.customerAddress}</p>
                  </div>
                </div>
              )}

              {order.deliveryType === "pickup" && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Location</p>
                    <p className="font-medium">Shop A6, Opp. Apollo Tower, E11/4 Islamabad</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rs {parseFloat(item.menuItem.price).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rs {(parseFloat(item.menuItem.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-destructive" data-testid="text-order-total">
                Rs {parseFloat(order.totalAmount).toLocaleString()}
              </span>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Payment Method: Cash on Delivery
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-8">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full" data-testid="button-back-home">
              Back to Home
            </Button>
          </Link>
          <Link href="/menu" className="flex-1">
            <Button className="w-full" data-testid="button-order-again">
              Order Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
