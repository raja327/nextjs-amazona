'use client';
import ProductPrice from '@/components/shared/products/product-price';
import { Card, CardContent } from '@/components/ui/card';
import {
  approvePayPalOrder,
  createPaypalOrder,
} from '@/lib/actions/order.action';
import { IOrder } from '@/lib/db/models/order.model';
import { formatDateTime } from '@/lib/utils';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { Button } from '@react-email/components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import StripeForm from './stripe-form';

export default function OrderDetailsForm({
  order,
  paypalClientId,
  clientSecret,
}: {
  order: IOrder;
  paypalClientId: string;
  isAdmin: boolean;
  clientSecret: string | null;
}) {
  const router = useRouter();
  const {
    shippingAddress,
    items,
    itemsPrice,

    shippingPrice,

    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order;

  if (isPaid) {
    redirect(`/account/orders/${order._id}`);
  }

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';
    if (isPending) {
      status = 'Loading paypal...';
    } else if (isRejected) {
      status = 'Error in loading Paypal.';
    }
    return status;
  }
  const handleCreatePayPalOrder = async () => {
    const res = await createPaypalOrder(order._id);
    if (!res.success) return toast.error(res.message);
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data);
    if (res.success) {
      toast.success(res.message);
      // Optionally navigate or refetch order
      router.push(`/account/orders/${order._id}`);
    } else {
      toast.error(res.message);
    }
  };

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        <div>
          <div className="text-lg font-bold">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span> </span>
              <ProductPrice price={itemsPrice} plain />
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {shippingAddress === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={itemsPrice} plain />
                )}
              </span>
            </div>
            {isPaid && paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {isPaid && paymentMethod === 'Stripe' && clientSecret && (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <StripeForm
                  priceInClients={Math.round(order.totalPrice * 100)}
                  orderId={order._id}
                />
              </Elements>
            )}

            {isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className="w-full rounded-full"
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  return (
    <main className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* shipping address */}
          <div>
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="tex-lg font-bold">
                <span>Shipping Address</span>
              </div>
              <div className="col-span-2">
                <p>
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street}
                  <br />
                  {`${shippingAddress.city},${shippingAddress.province},${shippingAddress.postalCode},${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>
          {/* payment method */}
          <div className="border-y">
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="text-lg font-bold">
                <span>Payment Method</span>
              </div>
              <div className="col-span-2">
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 my-3 pb-3">
            <div className="flex text-lg font-bold">
              <span>Items and shipping</span>
            </div>
            <div className="col-span-2">
              <p>
                Delivery date:
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name}x{item.quantity}={item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="block md:hidden">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </main>
  );
}
