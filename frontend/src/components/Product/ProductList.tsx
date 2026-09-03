"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";
import { getTime } from "@/utils/dateFormatter";
import { apiRequest } from "@/services/apiClient";
import styles from "./ProductList.module.css";

interface ProductListProps {
  onProductClick: (id: number) => void;
  selectedProductId?: number | null;
}

export default function ProductList({
  onProductClick,
  selectedProductId,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const data = await apiRequest<Product[]>("/product/", {
          signal: controller.signal,
        });
        if (!Array.isArray(data)) throw new Error("Invalid products response");
        setProducts(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Failed to load products");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, []);

  const sortByExpirationDate = (products: Product[]): Product[] => {
    return [...products].sort((a, b) => {
      if (!a.expirationDate) return 1; // Push 'a' to the end if no expiration date
      if (!b.expirationDate) return -1; // Push 'b' to the end if no expiration date

      return getTime(a.expirationDate) - getTime(b.expirationDate);
    });
  };

  const sortedProducts = sortByExpirationDate(products);

  if (isLoading) return <p className={styles.message}>Loading products...</p>;
  if (error) return <p className={styles.error}>Failed to load products: {error}</p>;

  return (
    <div className={styles.list}>
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}
