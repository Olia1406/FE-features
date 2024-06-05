export interface Product {
    _id?: string;
    name: string;
    description: string;
    category: string;
    image: any;
    price: number;
    isLiked?: boolean;
}