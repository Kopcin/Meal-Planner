"use client";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return message ? <p className="text-red-500 mb-4">{message}</p> : null;
}
