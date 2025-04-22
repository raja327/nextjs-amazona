import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutForm from './checkout-form';

export const metadata: Metadata = {
  title: 'Checkout',
};

const CheckoutPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/checkout');
  }
  return <CheckoutForm />;
};

export default CheckoutPage;
