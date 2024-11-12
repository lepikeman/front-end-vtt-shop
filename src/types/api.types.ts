export interface BaseResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface Product {
  id: number;
  product_name: string;
  price: number;
  description: string;
  factorynew: boolean;
}
