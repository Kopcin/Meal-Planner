"use client";
import styles from "./FormFields.module.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
}

export default function TextInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  ...props
}: TextInputProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.input}
        {...props}
      />
    </div>
  );
}
