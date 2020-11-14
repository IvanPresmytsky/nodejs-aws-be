export type TProductId = {
  id: string;
};

export type TDBProduct = TProductId & {
  title: string;
  description: string;
  price: number;
};

export type TDBStock = {
  stock_id: string;
  product_id: string;
  count: number;
};

export type TProduct = TDBProduct & {
  count: number;
};

export type TProducts = TProduct[];
