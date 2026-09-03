"use client";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return message ? <p className={styles.message}>{message}</p> : null;
}
