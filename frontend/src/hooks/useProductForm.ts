import { useState } from "react";

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
      const response = await fetch("http://localhost:8080/api/product/", {
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

      // TODO: handle different error causes (validation, network, etc.)
      if (!response.ok) {
        let errorMessage ="Failed to submit form";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message;
        } catch {
          // If parsing fails, keep the generic error message
        }
    
        switch (response.status) {
          case 400:
            setError(errorMessage || "Invalid input. Please check your data.");
            return;

          case 401:
            setError("Unauthorized. Please log in.");
            return;

          case 403:
            setError("Forbidden. You don't have permission to perform this action.");
            return;
            
          case 500:
            setError("Server error. Please try again later.");
            return;

          default:
            setError(errorMessage);
            return;
        }
      }

      const data = await response.json();

      console.log("Product added:", data);

      // If the request is successful, clear the form
      setName("");
      setDescription("");
      setPrice("");

      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      
      setError("Connection to the server failed. Please try again later.");
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
