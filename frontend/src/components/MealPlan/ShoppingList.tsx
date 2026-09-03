import styles from "./ShoppingList.module.css";

type Props = {
  items: string[];
};

export default function ShoppingList({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shopping List</h2>
        <span className={styles.badge}>{items.length} items</span>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <span key={item} className={styles.item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
