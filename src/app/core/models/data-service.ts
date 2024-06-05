import { Observable } from "rxjs";

export abstract class DataService<T> {
  abstract getItems: () => Observable<T[]>
}
