'use client';
import useCartSidebar from '@/app/hooks/use-cart-sidebar';
import React from 'react';
import { Toaster } from '../ui/sonner';
import CartSidebar from './cart-sidebar';

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const isCartSidebarOpen = useCartSidebar();
  return (
    <>
      {isCartSidebarOpen ? (
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-hidden">{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </>
  );
};

export default ClientProviders;
