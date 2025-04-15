import useCartStore from '@/app/hooks/use-cart-store';
import React from 'react';
import ProductPrice from './products/product-price';
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { Select, SelectItem, SelectTrigger } from '../ui/select';
import { SelectContent, SelectValue } from '@radix-ui/react-select';
import { TrashIcon } from 'lucide-react';

const CartSidebar = () => {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();
  return (
    <div className="w-36 overflow-y-auto">
      <div className="flex border-l h-full">
        <div className="p-2 h-full flex-col gap-2 justify-start items-center">
          <div className="text-center space-y-2">
            <div>Subtotal</div>
            <div className="font-bold">
              <ProductPrice price={itemsPrice} plain />
            </div>
            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className="text-center text-xs">
                your order qualifies for free shipping
              </div>
            )}
            <Link
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'rounded-full hover:no-underline w-full'
              )}
              href={'/cart'}
            >
              Go to cart
            </Link>
            <Separator className="mt-3" />
            <ScrollArea className="flex-1 w-full">
              {items.map((item) => (
                <div key={item.clientId}>
                  <div className="my-3">
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative h-24">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="text-sm text-center font-bold">
                      <ProductPrice price={item.price} plain />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Select
                        onValueChange={(value) => {
                          updateItem(item, Number(value));
                        }}
                        value={item.quantity.toString()}
                      >
                        <SelectTrigger className="text-xs w-12 ml-1 h-auto py-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: item.countInStock }).map(
                            (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                              ></SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => {
                          removeItem(item);
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
