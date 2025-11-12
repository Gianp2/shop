import { useState, useEffect } from "react";

const mockProducts = [
  { id: "1", title: "Remera Negra", price: 12000, stock: 15, category: "Ropa" },
  { id: "2", title: "Zapatillas Urbanas", price: 35000, stock: 8, category: "Calzado" },
];

const mockOrders = [
  { id: "1", total: 47000, date: "2025-11-12", items: 2 },
];

const mockUsers = [
  { id: "admin", email: "admin@example.com" },
];

export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let data = [];

        switch (collectionName) {
          case "products":
            data = mockProducts;
            break;
          case "orders":
            data = mockOrders;
            break;
          case "users":
            data = mockUsers;
            break;
          default:
            data = [];
        }

        // simulamos retardo de carga
        await new Promise((r) => setTimeout(r, 500));
        setDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collectionName]);

  return { documents, loading, error };
};
