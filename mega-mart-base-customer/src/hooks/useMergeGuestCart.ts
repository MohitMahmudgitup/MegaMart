import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/featured/auth/authSlice';
import { selectCustomer } from '@/redux/featured/customer/customerSlice';
import { useUpdateCustomerMutation } from '@/redux/featured/customer/customerApi';
import { getGuestCart, clearGuestCart } from '@/utils/guestCart';
import toast from 'react-hot-toast';

export const useMergeGuestCart = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const customer = useAppSelector(selectCustomer);
  const [updateCustomer] = useUpdateCustomerMutation();

  useEffect(() => {
    if (!currentUser || !customer) return;

    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    const existingItems = customer?.cartItem?.[0]?.productInfo ?? [];

    // Merge: guest items + existing DB items (duplicate check)
    const merged = [...existingItems.map((item: any) => ({
      productId: [String(item.productId[0]._id || item.productId[0])],
      quantity: item.quantity,
      totalAmount: item.totalAmount,
      color: item.color || '',
      size: item.size || '',
    }))];

    for (const guestItem of guestItems) {
      const exists = merged.find(
        i => i.productId[0] === guestItem.productId &&
             i.color === guestItem.color &&
             i.size === guestItem.size
      );
      if (exists) {
        exists.quantity += guestItem.quantity;
      } else {
        merged.push({
          productId: [guestItem.productId],
          quantity: guestItem.quantity,
          totalAmount: guestItem.totalAmount,
          color: guestItem.color,
          size: guestItem.size,
        });
      }
    }

    updateCustomer({
      id: customer._id,
      body: {
        cartItem: [{ userId: currentUser._id, productInfo: merged }],
      },
    }).then(() => {
      clearGuestCart();
      toast.success(`${guestItems.length} item(s) moved to your cart!`);
    });
  }, [currentUser?._id, customer?._id]); // শুধু user/customer change-এ run করবে
};