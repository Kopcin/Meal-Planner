"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./loginPage.module.css";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // TODO: add logging with email
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Login failed");
            }

            const data = await res.json();

            Cookies.set("token", data.token, {
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: 1 // 1 day
            });

            router.push("/mealPlanner");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.page}>
          <div className={styles.card}>
            <h1 className={styles.title}>Login</h1>

            <form onSubmit={handleLogin} className={styles.form}>
                <input
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button
                    type="submit"
                    className={styles.button}
                >
                    Login
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
          </div>
        </div>
    );
}
