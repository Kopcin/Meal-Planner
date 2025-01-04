import { Product } from "@/types/Product";

export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  databaseProducts: Product[];
  unassignedProducts: string[];
  image?: string;
}
