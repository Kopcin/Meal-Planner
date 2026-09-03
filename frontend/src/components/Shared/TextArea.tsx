"use client";
import styles from "./FormFields.module.css";

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  required = false,
}: TextAreaFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.textarea}
      />
    </div>
  );
}
