export interface IProduct {
    _id: string;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    salePrice?: number;
    stock: number;
    sku: string;
    images?: string[];
    isFeatured: boolean;
    isPublished: boolean;
    rating: number;
    totalReviews: number;
    tags?: string[];
    brand: string;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface IProductResponse {
    status: string;
    message: string;
    data: {
      totalCount: number;
      products: IProduct[];
      pagination: {
        totalPages: number;
        currentPage: number;
        nextPage: boolean;
        previousPage: boolean;
        pageSize: number;
      };
    };
  }
  
  export interface IProductWithPosition extends IProduct {
    position: number;
  }