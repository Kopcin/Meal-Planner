"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/Product/ProductDetail";
import ProductForm from "@/components/Product/ProductForm";
import ProductList from "@/components/Product/ProductList";
import styles from "./fridgePage.module.css";

export default function FridgePage() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fridge</h1>
          <p className={styles.subtitle}>Manage your products and track what you have at home.</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All products</h2>
          <ProductList onProductClick={handleProductClick} />
        </section>

        {selectedProductId !== null && (
          <section className={styles.detail}>
            <h2 className={styles.sectionTitle}>Selected product</h2>
            <ProductDetail productId={selectedProductId} />
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Add product</h2>
          <ProductForm />
        </section>
      </main>
    </div>
  );
}
