import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, OrderItem } from '@/types';
import { calcDeliveryDateAndPrice } from '@/lib/actions/order.action';

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
};

interface CartStore {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void;
}

const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      cart: initialState,
      addItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;

        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        );

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error('Product is out of stock');
          }
        } else {
          if (item.countInStock < quantity) {
            throw new Error('Product is out of stock');
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.size === item.size &&
              x.color === item.color
                ? { ...x, quantity: x.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        // const deliveryData = await calcDeliveryDateAndPrice({
        //   items: updatedCartItems,
        // });

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({ items: updatedCartItems })),
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        return updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        )?.clientId!;
      },
      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart;
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        );
        if (!exist) return;
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.size === item.size &&
          x.color === item.color
            ? { ...x, quantity }
            : x
        );
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({ items: updatedCartItems })),
          },
        });
      },
      removeItem: async (item: OrderItem) => {
        const { items } = get().cart;
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.size !== item.size ||
            x.color !== item.color
        );
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({ items: updatedCartItems })),
          },
        });
      },

      init: () => set({ cart: initialState }),
    }),
    {
      name: 'cart-store',
    }
  )
);

export default useCartStore;
