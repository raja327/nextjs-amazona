'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils';
import { ShippingAddressSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  APP_NAME,
  AVAILABLE_DELIVERY_DATES,
  AVAILABLE_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from '@/lib/constants';
import useCartStore from '../hooks/use-cart-store';
import useIsMounted from '../hooks/use-is-mounted';

import { ShippingAddress } from '@/types';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductPrice from '@/components/shared/products/product-price';
import CheckoutFooter from './checkout-footer';

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        country: 'Canada',
        zipCode: 'H2Y 1M1',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        country: '',
        zipCode: '',
      };

const CheckoutForm = () => {
  const router = useRouter();
  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    setDeliveryDateIndex,
  } = useCartStore();
  const isMounted = useIsMounted();

  const shippingAddressFrom = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  });

  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values);
    setIsAddressSelected(true);
  };
  useEffect(() => {
    if (!isMounted || !shippingAddress) return;
    shippingAddressFrom.setValue('fullName', shippingAddress.fullName);
    shippingAddressFrom.setValue('street', shippingAddress.street);
    shippingAddressFrom.setValue('city', shippingAddress.city);
    shippingAddressFrom.setValue('province', shippingAddress.province);
    shippingAddressFrom.setValue('phone', shippingAddress.phone);
    shippingAddressFrom.setValue('country', shippingAddress.country);
    shippingAddressFrom.setValue('postalCode', shippingAddress.postalCode);
  }, [items, isMounted, router, shippingAddress, shippingAddressFrom]);

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false);
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false);

  const handlePlaceOrder = async () => {
    // todo here:place order
  };

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true);
    setIsPaymentMethodSelected(true);
  };
  const handleSelectShippingAddress = () => {
    shippingAddressFrom.handleSubmit(onSubmitShippingAddress)();
  };
  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        {!isAddressSelected && (
          <div className="border-b mb-4">
            <Button
              className="rounded-full w-full"
              onClick={handleSelectShippingAddress}
            >
              Skip to this address
            </Button>
            <p className="text-xs text-center py-2">
              Choose a shipping address and payment method in order to calculate
              shipping,handling and tax.
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className="mb-4">
            <Button
              className="rounded-full w-full"
              onClick={handleSelectPaymentMethod}
            >
              Use this payment method
            </Button>

            <p className="text-xs text-center py-2">
              Choose a payment method to continue checking out .You &apos;ll
              still have a chance to review and edit your order before it
              &apos;s final.
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div>
            <Button onClick={handlePlaceOrder} className="rounded-full w-full">
              {' '}
              Place Order
            </Button>
            <p className="text-xs text-center py-2">
              By placing your order, you agree to {APP_NAME} &apos;s{' '}
              <Link href={'/page/privacy-policy'}>Privacy Policy</Link>
              and{' '}
              <Link href={'/page/conditions-of-use'}>Conditions of Use</Link>.
            </p>
          </div>
        )}
        <div>
          <div className="text-lg font-bold">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>
                <ProductPrice plain price={itemsPrice} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'Free'
                ) : (
                  <ProductPrice plain price={shippingPrice} />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice plain price={taxPrice} />
                )}
              </span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg">
              <span> Order Total:</span>
              <span>
                <ProductPrice plain price={totalPrice} />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="max-w-6xl mx-auto highlight-link">
      <div className="grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-3">
          {/* shippingAddress */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className="grid gird-cols-1 md:grid-cols-12 my-3 pb-3">
                <div className="col-span-5 flex text-lg font-bold">
                  <span>Shipping Address</span>
                </div>
                <div className="col-span-5">
                  <p>
                    {shippingAddress.fullName} <br />
                    {shippingAddress.street} <br />
                    {`${shippingAddress.city}, ${shippingAddress.province},${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
                <div className="col-span-2">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsAddressSelected(false);
                      setIsPaymentMethodSelected(true);
                      setIsDeliveryDateSelected(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">1</span>
                  <span>Enter shipping address</span>
                </div>
                <Form {...shippingAddressFrom}>
                  <form
                    className="space-y-4"
                    method="POST"
                    onSubmit={shippingAddressFrom.handleSubmit(
                      onSubmitShippingAddress
                    )}
                  >
                    <Card className="md:ml-8 my-4">
                      <CardContent className="p-4 space-y-2">
                        <div className="text-lg font-bold mb-2">
                          Your address
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            control={shippingAddressFrom.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter full name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={shippingAddressFrom.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter address"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            name="city"
                            control={shippingAddressFrom.control}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter City" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingAddressFrom.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter province"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingAddressFrom.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter country"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            control={shippingAddressFrom.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter postal code"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressFrom.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button type="submit" className="w-full font-bold">
                          Ship to the address
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className="border-y">
            {isPaymentMethodSelected && paymentMethod ? (
              <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                <div className="flex text-lg font-bold col-span-5">
                  <span className="w-8">2</span>
                  <span>Payment method</span>
                </div>
                <div className="col-span-5">
                  <p>{paymentMethod}</p>
                </div>
                <div className="col-span-2">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(false);
                      if (paymentMethod) setIsDeliveryDateSelected(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">2</span>
                  <span>Choose a payment method</span>
                </div>
                <Card className="md:ml-8 my-4">
                  <CardContent className="p-4">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {AVAILABLE_PAYMENT_METHODS.map((pm) => (
                        <div key={pm.name} className="flex items-center py-1">
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className="font-bold pl-2 cursor-pointer"
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className="w-full font-bold"
                    >
                      Use this payment method
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">2</span>
                <span>Choose a payment method</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex !== undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                <div className="flex text-lg font-bold col-span-5">
                  <span className="w-8">3</span>
                  <span>Items and shipping</span>
                </div>
                <div className="col-span-5">
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          AVAILABLE_DELIVERY_DATES[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity}={item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(true);
                      setIsDeliveryDateSelected(false);
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">3</span>
                  <span>Review items and shipping</span>
                </div>
                <Card className="md:ml-8 ">
                  <CardContent className="p-4">
                    <p className="mb-2">
                      <span className="text-lg font-bold text-green-700">
                        Arriving{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      If you order in the next {timeUntilMidnight().hours} hours
                      and {timeUntilMidnight().minutes} minutes.
                    </p>
                    <div className="grid  md:grid-cols-2  gap-6">
                      <div className="">
                        {items.map((item, _index) => (
                          <div key={_index} className="flex gap-4 py-2">
                            <div className="relative w-20 h-20">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="20vw"
                              />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold">
                                {item.name},{item.color},{item.size}
                              </p>
                              <p className="font-bold">
                                <ProductPrice price={item.price} plain />
                              </p>
                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') {
                                    removeItem(item);
                                  } else {
                                    updateItem(item, Number(value));
                                  }
                                }}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key={'delete'} value={'0'}>
                                    Delete
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="font-bold">
                        <p className="mb-2">Choose a shipping speed:</p>
                        <ul>
                          <RadioGroup
                            value={
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex!].name
                            }
                            onValueChange={(value) => {
                              setDeliveryDateIndex(
                                AVAILABLE_DELIVERY_DATES.findIndex(
                                  (address) => address.name === value
                                )!
                              );
                            }}
                          >
                            {AVAILABLE_DELIVERY_DATES.map((dd) => (
                              <div key={dd.name} className="flex">
                                <RadioGroupItem
                                  value={dd.name}
                                  id={`address-${dd.name}`}
                                />
                                <Label
                                  className="pl-2 space-y-2 cursor-pointer"
                                  htmlFor={`address-${dd.name}`}
                                >
                                  <div className="text-green-700 font-semibold">
                                    {
                                      formatDateTime(
                                        calculateFutureDate(dd.daysToDeliver)
                                      ).dateOnly
                                    }
                                  </div>
                                  <div>
                                    {(dd.freeShippingMinPrice > 0 &&
                                    itemsPrice >= dd.freeShippingMinPrice
                                      ? 0
                                      : dd.shippingPrice) === 0 ? (
                                      'free shipping'
                                    ) : (
                                      <ProductPrice
                                        price={dd.shippingPrice}
                                        plain
                                      />
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">3</span>
                <span> Items and shipping</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className="mt-6">
              <div className="block md:hidden">
                <CheckoutSummary />
              </div>
              <Card className="md:block hidden">
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-3">
                  <Button className="rounded-full " onClick={handlePlaceOrder}>
                    Place order
                  </Button>
                  <div className="flex-1">
                    <p className="font-bold text-lg">
                      Order Total: <ProductPrice price={itemsPrice} plain />
                    </p>
                    <p className="text-xs">
                      {' '}
                      By placing order ,you agree to {APP_NAME}&apos;s{' '}
                      <Link href={'/page/privacy-policy'}>Privacy Notice</Link>{' '}
                      and{' '}
                      <Link href={'/page/conditions-of-use'}>
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
};

export default CheckoutForm;
