"use client";

import useProductForm from "@/hooks/useProductForm";
import ErrorMessage from "../Shared/ErrorMessage";
import TextInput from "../Shared/TextInput";
import TextArea from "../Shared/TextArea";
import SubmitButton from "../Shared/SubmitButton";

export default function ProductForm() {
  const {
    name,
    description,
    price,
    error,
    setName,
    setDescription,
    setPrice,
    handleSubmit,
  } = useProductForm();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <ErrorMessage message={error} />
      <TextInput
        label="Name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextArea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <TextInput
        label="Price"
        id="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        step="0.01"
      />

      <SubmitButton label="Submit" />
    </form>
  );
}
