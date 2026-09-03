"use client";

import { Product } from "@/types/Product";
import { formatDateString } from "@/utils/dateFormatter";
import Image from "next/image";
import styles from "./ProductCard.module.css";

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
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={product.name}
          width={150}
          height={200}
          layout="responsive"
          objectFit="cover"
          priority
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>
          {product.name}
        </h2>
        <p className={styles.description}>
          {product.description}
        </p>
        <p className={styles.expiration}>
          {formatDateString(product.expirationDate)}
        </p>
        <div className={styles.price}>
          {product.price ? `${product.price} zł` : "Brak ceny"}
        </div>
      </div>
    </div>
  );
}
