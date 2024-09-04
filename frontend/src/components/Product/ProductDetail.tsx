"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import ProductCard from "./ProductCard";

interface ProductDetailProps {
  productId: number;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/product/${productId}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: Product = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return product ? (
    <div className="flex justify-center">
      <ProductCard product={product} />
    </div>
  ) : (
    <p>Product not found</p>
  );
}
