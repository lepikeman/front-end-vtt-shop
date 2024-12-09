import { useEffect, useState } from "react";
import { Product } from "../types/api.types.ts";
import { apiService } from "../services/api.service.ts";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await apiService.getProduct();
        setProducts(fetchedProducts);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error getting products"
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h2>Liste des Produits</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <strong>{product.product_name}</strong>
            <p>Prix : {product.price}€</p>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
