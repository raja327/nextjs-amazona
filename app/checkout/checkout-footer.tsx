import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function CheckoutFooter() {
  return (
    <div className="border-t-2 space-y-2 my-4 py-4">
      <p>
        Need help? Check Our <Link href={'/page/help'}>Help Center</Link> or{' '}
        <Link href={'/page/contact-us'}>Contact Us</Link>{' '}
      </p>
      <p>
        For an item ordered from {APP_NAME}:When you click the &apos; Place your
        Order &apos; button ,we will send you and e-mail acknowledging receipt
        of your order. Your contract to purchase an item will not be complete
        until we send you an e-mail notifying you that the item has been shipped
        to you. By placing your order, you agree to {APP_NAME} &apos;s{' '}
        <Link href={'/page/conditions-of-use'}>conditions of use</Link>.
      </p>
      <p>
        Within 30 days of delivery,you may return new, unopened merchandise in
        its original condition.Exceptions and restriction apply .{' '}
      </p>
      <Link href={'/page/returns-policy'}>
        See {APP_NAME}&apos;s Returns Policy
      </Link>
    </div>
  );
}
