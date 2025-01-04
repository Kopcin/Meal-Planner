"use client";

import { Product } from "@/types/Product";
import { formatExpirationDateString } from "@/utils/dateFormatter";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function ProductCard({
  product,
  onClick,
  isSelected,
}: ProductCardProps) {
  const image = product.image || "/images/placeholderImg150x200.png";

  return (
    <div
      className={`product-card border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 ${
        isSelected ? "border-blue-500 scale-105 z-10" : ""
      }`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <div className="image-wrapper">
        <Image
          src={image}
          alt={product.name}
          width={150}
          height={200}
          layout="responsive"
          objectFit="cover"
          priority
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {product.description}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {formatExpirationDateString(product.expirationDate)}
        </p>
        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          {product.price ? `${product.price} zł` : "Brak ceny"}
        </div>
      </div>
    </div>
  );
}
