import { useState } from "react";
import { apiRequest } from "@/services/apiClient";

export default function useProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(""); // Clear any previous errors

    // if (parseFloat(price) < 0) {
    //   setError("Price must be a non-negative number.");
    //   return;
    // }

    try {
      await apiRequest("/product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price as string), // why string?
        }),
      });

      // If the request is successful, clear the form
      setName("");
      setDescription("");
      setPrice("");

      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Connection to the server failed.");
    }
  };

  return {
    name,
    description,
    price,
    error,
    setName,
    setDescription,
    setPrice,
    handleSubmit,
  };
}
