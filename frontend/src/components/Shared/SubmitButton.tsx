"use client"
import styles from "./FormFields.module.css";

interface SubmitButtonProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button}
    >
      {label}
    </button>
  );
}
