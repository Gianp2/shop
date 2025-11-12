import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useCartContext } from "./useCartContext";
import { addAllItemsQuantity } from "helpers/item";
import { CustomError } from "helpers/error/customError";
import { handleError } from "helpers/error/handleError";

// Simulación de stock local
const mockSkus = [
  { skuId: "sku-1", productId: "1", quantity: 10 },
  { skuId: "sku-2", productId: "2", quantity: 5 },
  { skuId: "sku-3", productId: "3", quantity: 0 }, // sin stock
];

export const useInventory = () => {
  const { user } = useAuthContext();
  const { dispatch } = useCartContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkInventory = async (items) => {
    setError(null);
    setIsLoading(true);

    try {
      let updatedItems = [...items];
      let stockDifference = false;

      for (const item of items) {
        const sku = mockSkus.find((s) => s.skuId === item.skuId);

        if (!sku || sku.quantity <= 0) {
          stockDifference = true;
          updatedItems = updatedItems.filter((i) => i.skuId !== item.skuId);
        } else if (sku.quantity < item.quantity) {
          stockDifference = true;
          const index = updatedItems.findIndex((i) => i.skuId === item.skuId);
          updatedItems[index].quantity = sku.quantity;
        }
      }

      const totalQuantity = addAllItemsQuantity(updatedItems);

      if (totalQuantity === 0) {
        dispatch({ type: "DELETE_CART" });
      } else if (stockDifference) {
        dispatch({ type: "UPDATE_CART", payload: updatedItems });
      }

      if (stockDifference) {
        throw new CustomError(
          "El stock disponible es limitado. Se ajustaron las cantidades del carrito."
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { checkInventory, isLoading, error };
};

export default useInventory;
