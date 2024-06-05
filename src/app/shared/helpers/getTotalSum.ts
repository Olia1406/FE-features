import { Product } from "@shared/interfaces/product.interface";

export function getTotalPrice(prodList: (Product & { qty: number })[]) {
   return prodList?.reduce((acc, prod) => {
     let sum = acc + prod.price*prod.qty
     return sum
   }, 0)
}