"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";
import { getTime } from "@/utils/dateFormatter";

interface ProductListProps {
  onProductClick: (id: number) => void;
  selectedProductId?: number | null;
}

export default function ProductList({
  onProductClick,
  selectedProductId,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/product/");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // const sortByExpirationDate = (products: Product[]): Product[] => {
  //   return products.sort(
  //     (a, b) => getTime(a.expirationDate) - getTime(b.expirationDate)
  //   );
  // };

  const sortByExpirationDate = (products: Product[]): Product[] => {
    return products.sort((a, b) => {
      if (!a.expirationDate) return 1; // Push 'a' to the end if no expiration date
      if (!b.expirationDate) return -1; // Push 'b' to the end if no expiration date

      return getTime(a.expirationDate) - getTime(b.expirationDate);
    });
  };

  const sortedProducts = sortByExpirationDate(products);

  return (
    <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}
