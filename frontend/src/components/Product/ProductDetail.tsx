"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import ProductCard from "./ProductCard";
import { apiRequest } from "@/services/apiClient";
import styles from "./ProductDetail.module.css";

interface ProductDetailProps {
  productId: number;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await apiRequest<Product>(`/product/${productId}`, {
          signal: controller.signal,
        });
        setProduct(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        console.error("Error fetching product:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch product.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProduct();
    return () => controller.abort();
  }, [productId]);

  if (loading) {
    return <p className={styles.message}>Loading product...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return product ? (
    <div className={styles.container}>
      <ProductCard product={product} />
    </div>
  ) : (
    <p className={styles.message}>Product not found</p>
  );
}
