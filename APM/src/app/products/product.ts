/* Defines the product entity */
export interface Product {
  id: number;
  productName: string;
  productCode: string;
  category: string;
  tags?: string[];
  releaseDate: string;
  price: number;
  cost: number;
  profit?: number,
  description: string;
  starRating: number;
  imageUrl: string;
}
