"use client";

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
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="form-input mt-1 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg"
        {...props}
      />
    </div>
  );
}
