"use client";

import Link from "next/link";
import styles from "./navbar.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/fridge", label: "Fridge" },
  { href: "/recipes", label: "Recipes" },
  { href: "/mealPlanner", label: "Meal Planner" },
];

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
