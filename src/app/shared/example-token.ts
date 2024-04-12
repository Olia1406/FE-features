import { InjectionToken } from "@angular/core";
import { ProductsService } from "../core/services/products.service";

export const EX_TOKEN = new InjectionToken<ProductsService>('server');
export const EX_TOKEN_WITH_DATA = new InjectionToken<Number>('server_can_be_the_same', {
    providedIn: 'root',
    factory: () => {
        return 12
    }
});
export const DATA_INJECTION_TOKEN = new InjectionToken<string>('DATA_INJECTION_TOKEN');