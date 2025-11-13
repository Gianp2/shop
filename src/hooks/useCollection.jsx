import { useState, useEffect } from "react";

import buzo1 from "assets/images/productos-buzo-flaakko-negro-1.jpg";
import buzo2 from "assets/images/productos-buzo-flaakko-negro-2.jpg";
import gorro1 from "assets/images/productos-gorro-baires-blanco-1.jpg";
import gorro2 from "assets/images/productos-gorro-baires-blanco-2.jpg";
import hoodie1 from "assets/images/productos-hoodie-de-gira-blanco-1.jpg";
import remera1 from "assets/images/productos-remera-de-gira-blanca-1.jpg";
import remera2 from "assets/images/productos-remera-ojos-negra-1.jpg";

const mockProducts = [
  {
    id: "1",
    variantId: "v1",
    productId: "p1",
    model: "Buzo Flaakko",
    type: "Negro",
    color: "Negro",
    price: 25000,
    actualPrice: 30000,
    discount: 17,
    stock: 10,
    category: "Buzos",
    slides: [
      { src: buzo1, url: "/products/1" },
      { src: buzo2, url: "/products/1" },
    ],
    skus: ["sku1", "sku2"],
    isSoldOut: false,
  },
  {
    id: "2",
    variantId: "v2",
    productId: "p2",
    model: "Gorro Baires",
    type: "Blanco",
    color: "Blanco",
    price: 12000,
    actualPrice: 15000,
    discount: 20,
    stock: 15,
    category: "Gorros",
    slides: [
      { src: gorro1, url: "/products/2" },
      { src: gorro2, url: "/products/2" },
    ],
    skus: ["sku3", "sku4"],
    isSoldOut: false,
  },
  {
    id: "3",
    variantId: "v3",
    productId: "p3",
    model: "Hoodie De Gira",
    type: "Blanco",
    color: "Blanco",
    price: 27000,
    actualPrice: 30000,
    discount: 10,
    stock: 8,
    category: "Hoodies",
    slides: [{ src: hoodie1, url: "/products/3" }],
    skus: ["sku5"],
    isSoldOut: false,
  },
  {
    id: "4",
    variantId: "v4",
    productId: "p4",
    model: "Remera De Gira",
    type: "Blanca",
    color: "Blanca",
    price: 18000,
    actualPrice: 20000,
    discount: 10,
    stock: 20,
    category: "Remeras",
    slides: [{ src: remera1, url: "/products/4" }],
    skus: ["sku6"],
    isSoldOut: false,
  },
  {
    id: "5",
    variantId: "v5",
    productId: "p5",
    model: "Remera Ojos",
    type: "Negra",
    color: "Negra",
    price: 18000,
    actualPrice: 20000,
    discount: 10,
    stock: 25,
    category: "Remeras",
    slides: [{ src: remera2, url: "/products/5" }],
    skus: ["sku7"],
    isSoldOut: false,
  },
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

        await new Promise((r) => setTimeout(r, 500)); // simula retardo
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
