"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./Navbar.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/fridge", label: "Fridge" },
  { href: "/recipes", label: "Recipes" },
  { href: "/mealPlanner", label: "Meal Planner" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setUsername(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as { sub?: string };
      setUsername(payload.sub ?? null);
    } catch {
      setUsername(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    setUsername(null);
    router.push("/");
  };

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
        <li className={styles.authItem}>
          {username ? (
            <div className={styles.authControls}>
              <span className={styles.authStatus}>Logged in as {username}</span>
              <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.navLink}>
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
