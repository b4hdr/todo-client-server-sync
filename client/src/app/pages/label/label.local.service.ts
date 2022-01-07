import { Injectable } from '@angular/core';
import { DbConnectionService } from 'src/app/service/dbconnection.service';
import { from, map, Observable } from 'rxjs';
import { TABLE_NAME_LABEL } from './label.table.model';
import { Label } from './label.model';

@Injectable({
  providedIn: 'root'
})
export class LabelLocalService {
  tableName = TABLE_NAME_LABEL;

  constructor(private dbConnectionService: DbConnectionService) { }

  get(filter?: any, query?: any): Observable<Label[]> {
    const where = filter || { isDeleted: 0 };

    const promise = this.dbConnectionService.connection.select<Label>({
      from: this.tableName,
      where: where,
      ...query
    });

    return from(promise);
  }

  getById(labelId: number): Observable<Label> {
    const where = { isDeleted: 0, id: labelId };

    return this.get(where)
      .pipe(map(labels => {
        if (labels && labels.length > 0)
          return labels[0];
        else
          return null;
      }));
  }

  add(labels: Label[], changeValues: boolean = true): Observable<Label[]> {
    if (changeValues) {
      for (let index = 0; index < labels.length; index++) {
        const label = labels[index];

        label.createDate = new Date();
        label.updateDate = new Date();
        label.isDeleted = 0;
        label.isDirty = 1;
        label.serverKey = null;
        label.timestamp = 0;
      }
    }

    const promise = this.dbConnectionService.connection.insert<Label>({
      into: this.tableName,
      return: true,
      values: labels
    }) as Promise<Label[]>;

    return from(promise);
  }

  update(label: Label, changeValues: boolean = true): Observable<number> {
    if (changeValues) {
      label.updateDate = new Date();
      label.isDirty = 1;
    }

    const promise = this.dbConnectionService.connection.update({
      in: this.tableName,
      where: {
        id: label.id
      },
      set: label
    });

    return from(promise);
  }

  delete(label: Label): Observable<number> {
    label.isDeleted = 1;

    return this.update(label);
  }

  getLastTimestamp(): Observable<number> {
    const query = { limit: 1, order: { by: 'timestamp', type: 'desc' } }; //biggest timestamp
    const filter = { "id": { '>': 0 } }; //dummy filter

    return this.get(filter, query)
      .pipe(map(labels => {
        let timestamp = 0;

        if (labels && labels.length > 0) {
          timestamp = labels[0].timestamp;
        }

        return timestamp;
      }));
  }
}