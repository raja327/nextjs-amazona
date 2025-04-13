'use client';

import useCartStore from '@/app/hooks/use-cart-store';
import BrowsingHistoryList from '@/components/shared/browising-history-list';
import ProductPrice from '@/components/shared/products/product-price';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CartAddItem({ itemId }: { itemId: string }) {
  const {
    cart: { items, itemsPrice },
  } = useCartStore();
  const item = items.find((x) => x.clientId === itemId);
  if (!item) {
    return notFound();
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <Card className="w-full rounded-none">
          <CardContent className="flex h-full items-center justify-center gap-3 py-4">
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Link>
            <div>
              <h3 className="text-xl font-bold flex gap-2 my-2">
                <CheckCircle2Icon className="text-green-700 h-6 w-6" />
                Add to Cart
              </h3>
              <p className="text-sm">
                <span className="font-bold">Color:</span>
                {item.color ?? '-'}
              </p>
              <p className="text-sm">
                <span className="font-bold">Size:</span>
                {item.size ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full rounded-none">
          <CardContent className="h-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex justify-center items-center">
                {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                  <div className="text-center">
                    Add
                    <span className="text-green-700">
                      <ProductPrice
                        price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                        plain
                      />
                    </span>
                    {''} of eligible items to your order to qualify for free
                    shipping.
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div>
                      <span className="text-green-700">
                        You qualify for free shipping
                      </span>{' '}
                      Choose this option at checkout
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3">
                <div className="flex gap-3">
                  <span className="text-lg font-bold">Cart Subtotal:</span>
                  <ProductPrice price={itemsPrice} className="text-2xl" />
                </div>
                <Link
                  href="/checkout"
                  className={cn(buttonVariants(), 'rounded-full w-full')}
                >
                  Proceed to Checkout (
                  {items.reduce((a, c) => a + c.quantity, 0)} items)
                </Link>
                <Link
                  href={'/cart'}
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  Go to Cart
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BrowsingHistoryList />
    </div>
  );
}
