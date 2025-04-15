'use client';

import useCartStore from '@/app/hooks/use-cart-store';
import useIsMounted from '@/app/hooks/use-is-mounted';
import { cn } from '@/lib/utils';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import useCartSidebar from '@/app/hooks/use-cart-sidebar';

export default function CartButton() {
  const isMounted = useIsMounted();
  const isCartSidebarOpen = useCartSidebar();
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
      {isCartSidebarOpen && (
        <div
          className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background bg-amber-700`}
        ></div>
      )}
    </Link>
  );
}
