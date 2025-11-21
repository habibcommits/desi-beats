import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { insertOrderSchema, type InsertOrder } from "@shared/schema";
import { Bike, Store, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const totalPrice = getTotalPrice();

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      deliveryType: "delivery",
      totalAmount: "0",
      status: "pending",
      items: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      return await apiRequest("POST", "/api/orders", data);
    },
    onSuccess: (data) => {
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${data.id.slice(0, 8)} has been received.`,
      });
      setLocation(`/order-confirmation/${data.id}`);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
      });
    },
  });

  const onSubmit = (data: InsertOrder) => {
    const orderData: InsertOrder = {
      ...data,
      totalAmount: totalPrice.toFixed(2),
      items: JSON.stringify(items.map(item => ({
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          image: item.menuItem.image
        },
        quantity: item.quantity
      }))),
    };
    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart before checking out
            </p>
            <Button onClick={() => setLocation("/menu")} data-testid="button-go-to-menu">
              Go to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="deliveryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem
                                  value="delivery"
                                  id="delivery"
                                  className="peer sr-only"
                                  data-testid="radio-delivery"
                                />
                                <label
                                  htmlFor="delivery"
                                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                                >
                                  <Bike className="h-8 w-8 mb-3" />
                                  <span className="font-semibold">Delivery</span>
                                </label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="pickup"
                                  id="pickup"
                                  className="peer sr-only"
                                  data-testid="radio-pickup"
                                />
                                <label
                                  htmlFor="pickup"
                                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                                >
                                  <Store className="h-8 w-8 mb-3" />
                                  <span className="font-semibold">Pickup</span>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              {...field} 
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="03XX-XXXXXXX" 
                              {...field} 
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("deliveryType") === "delivery" && (
                      <FormField
                        control={form.control}
                        name="customerAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your complete delivery address"
                                className="resize-none"
                                rows={3}
                                {...field}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={createOrderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <span className="font-medium">{item.menuItem.name}</span>
                        <span className="text-muted-foreground"> x{item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        Rs {(parseFloat(item.menuItem.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">Rs {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-destructive" data-testid="text-checkout-total">
                      Rs {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Payment will be collected on delivery (Cash on Delivery)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
