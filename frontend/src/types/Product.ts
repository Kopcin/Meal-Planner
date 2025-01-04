export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  expirationDate?: Date | number[];
  image?: string;
}
