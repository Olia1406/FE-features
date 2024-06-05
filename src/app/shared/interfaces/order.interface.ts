export interface Order {
    _id?: string;
    name: string; 
    wayToPayId: string; 
    address: string;
    productsList: {_id: string, qty: number}[];
    isDelivered: boolean;
}