import { DataSource } from "@angular/cdk/table";
import { DataService } from "./data-service";
import { Observable } from "rxjs";

export class GeneralDataSource<
  K,
  T extends DataService<K>,
> extends DataSource<K> {
  data: Observable<K[]>;
  constructor(private serv: T) {
    super();
    /** Stream of data that is provided to the table. */
    this.data = this.serv.getItems();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<K[]> {
    return this.data;
  }

  disconnect() {}
}