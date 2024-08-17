"use client";

import { useState } from "react";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (parseFloat(price) < 0) {
    //   setError("Price must be a non-negative number.");
    //   return;
    // }

    setError(""); // Clear any previous errors

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
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="form-input mt-1 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          autoComplete="off"
          className="form-textarea mt-1 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          step="0.01"
          autoComplete="off"
          className="form-input mt-1 block w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
