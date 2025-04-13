'use client';

import useCartStore from '@/app/hooks/use-cart-store';
import useIsMounted from '@/app/hooks/use-is-mounted';
import { cn } from '@/lib/utils';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

export default function CartButton() {
  const isMounted = useIsMounted();
  const {
    cart: { items },
  } = useCartStore();
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0);
  return (
    <Link href={'/cart'} className="px-1 header-button">
      <div className="flex flex-end text-xs relative">
        <ShoppingCartIcon className="h-8 w-8" />
        {isMounted && (
          <span
            className={cn(
              `bg-black px-1 rounded-full text-primary text-base absolute right-[30px] top-[-4px] z-10`,
              cartItemsCount >= 10 && 'text-sm px-0 p-[1px]'
            )}
          >
            {cartItemsCount}
          </span>
        )}
      </div>
      <span className="font-bold">Cart</span>
    </Link>
  );
}
