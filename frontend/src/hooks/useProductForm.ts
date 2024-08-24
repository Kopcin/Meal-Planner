import { useState } from "react";

export default function useProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    // if (parseFloat(price) < 0) {
    //   setError("Price must be a non-negative number.");
    //   return;
    // }

    try {
      const response = await fetch("http://localhost:8080/api/product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price as string),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // If the request is successful, clear the form
      setName("");
      setDescription("");
      setPrice("");
      alert("Product added successfully!");

      const data = await response.json();
      console.log("Product added:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product");
      setError("Failed to add product");
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
