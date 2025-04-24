import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants';
import { IOrder } from '@/lib/db/models/order.model';
import PurchaseReceiptEmail from './purchase-receipt';
import { Resend } from 'resend';
import { formatId } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: `Order ${formatId(order._id)} confirmation`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
