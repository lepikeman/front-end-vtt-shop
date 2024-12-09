import { useEffect, useState } from "react";
import { Product } from "../types/api.types.ts";
import axios from "axios";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://54.37.11.89:3000/products");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          throw new Error("No data provided");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error getting products",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products || !Array.isArray(products)) return <p>Aucun Produit trouvé</p>;
  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.product_name} - {product.price}€ {product.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
