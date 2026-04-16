const GUEST_CART_KEY = 'guest_cart';
const GUEST_ORDERS_KEY = 'guest_orders';

export type GuestCartItem = {
  productId: string;
  quantity: number;
  totalAmount: number;
  color: string;
  size: string;
  featuredImg?: string;
  name?: string;
  salePrice?: number;
};

// ─── Cart ───────────────────────────────────────────────────

export const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

export const setGuestCart = (items: GuestCartItem[]) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

export const addToGuestCart = (item: GuestCartItem) => {
  const cart = getGuestCart();

  const existingIdx = cart.findIndex(
    i =>
      i.productId === item.productId &&
      i.color === item.color &&
      i.size === item.size
  );

  if (existingIdx >= 0) {
    cart[existingIdx].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  setGuestCart(cart);
  window.dispatchEvent(new Event('guestCartUpdated'));
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

// ─── Guest Orders ────────────────────────────────────────────

export const getGuestOrderIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addGuestOrderId = (orderId: string) => {
  const orders = getGuestOrderIds();
  if (!orders.includes(orderId)) {
    orders.push(orderId);
    localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
  }
};

export const clearGuestOrders = () => {
  localStorage.removeItem(GUEST_ORDERS_KEY);
};