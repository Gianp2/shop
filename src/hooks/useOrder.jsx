import { useState } from 'react';
import moment from 'moment';

import {
  writeBatch,
  doc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
} from 'db/mockFirestore';

import { db } from 'db/config';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';
import { useCheckoutContext } from './useCheckoutContext';
import { useCart } from './useCart';
import { useCheckout } from './useCheckout';

import { handleError } from 'helpers/error/handleError';

// 🧩 Simula la función increment de Firebase
const increment = (value = 1) => {
  return (prevValue) => (prevValue || 0) + value;
};

export const useOrder = () => {
  const { user } = useAuthContext();
  const { items } = useCartContext();
  const { email, shippingAddress, shippingOption, shippingCost } =
    useCheckoutContext();
  const { deleteCart } = useCart();
  const { deleteCheckoutSession } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const ordersRef = collection(db, 'orders');

  const createOrder = async (paymentInfo, billingAddress) => {
    setError(null);
    setIsLoading(true);

    try {
      const batch = writeBatch(db);

      // 🔧 Simula la actualización de stock de productos
      for (const item of items) {
        const skuRef = doc(collection(db, 'products', item.productId, 'skus'), item.skuId);
        const currentStock = item.stock ?? 10; // valor por defecto si no existe stock
        const newStock = increment(-item.quantity)(currentStock);

        // Usamos updateDoc o batch.update según lo que tenga mockFirestore
        if (batch.update) {
          batch.update(skuRef, { quantity: newStock });
        } else {
          await updateDoc(skuRef, { quantity: newStock });
        }
      }

      if (batch.commit) {
        await batch.commit();
      }

      // 🔧 Crea la orden
      await addDoc(ordersRef, {
        createdAt: moment().toDate(),
        items,
        email,
        shippingAddress,
        shippingOption,
        shippingCost,
        paymentInfo,
        billingAddress,
        createdBy: user?.uid ?? 'guest',
      });

      await deleteCart();
      await deleteCheckoutSession();

      setIsLoading(false);
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    setError(null);
    try {
      const orders = [];

      const q = query(
        ordersRef,
        where('createdBy', '==', user?.uid ?? 'guest'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docItem) => {
        orders.push({ id: docItem.id, ...docItem.data() });
      });

      return orders;
    } catch (err) {
      console.error('Error al obtener órdenes:', err);
      setError(handleError(err));
    }
  };

  return { createOrder, getOrders, isLoading, error };
};
