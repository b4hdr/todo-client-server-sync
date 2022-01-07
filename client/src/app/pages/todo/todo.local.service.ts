import { Injectable } from '@angular/core';
import { ITodo } from './todo.model';
import { DbConnectionService } from 'src/app/service/dbconnection.service';
import { from, map, Observable } from 'rxjs';
import { TABLE_NAME_TODO } from './todo.table.model';

@Injectable({
  providedIn: 'root'
})
export class TodoLocalService {
  tableName = TABLE_NAME_TODO;

  constructor(private dbConnectionService: DbConnectionService) { }

  get(filter?: any, query?: any): Observable<ITodo[]> {
    const where = filter || { isDeleted: 0 };

    const promise = this.dbConnectionService.connection.select<ITodo>({
      from: this.tableName,
      where: where,
      ...query
    });

    return from(promise);
  }

  getById(todoId: number): Observable<ITodo> {
    const where = { isDeleted: 0, id: todoId };

    return this.get(where)
      .pipe(map(todos => {
        if (todos && todos.length > 0)
          return todos[0];
        else
          return null;
      }));
  }

  add(todos: ITodo[], changeValues: boolean = true): Observable<ITodo[]> {
    if (changeValues) {
      for (let index = 0; index < todos.length; index++) {
        const todo = todos[index];

        todo.createDate = new Date();
        todo.updateDate = new Date();
        todo.isDeleted = 0;
        todo.isDirty = 1;
        todo.serverKey = null;
        todo.isCompleted = 0;
        todo.timestamp = 0;
      }
    }

    const promise = this.dbConnectionService.connection.insert<ITodo>({
      into: this.tableName,
      return: true,
      values: todos
    }) as Promise<ITodo[]>;

    return from(promise);
  }

  update(todo: ITodo, changeValues: boolean = true): Observable<number> {
    if (changeValues) {
      todo.updateDate = new Date();
      todo.isDirty = 1;
    }

    const promise = this.dbConnectionService.connection.update({
      in: this.tableName,
      where: {
        id: todo.id
      },
      set: todo
    });

    return from(promise);
  }

  delete(todo: ITodo): Observable<number> {
    todo.isDeleted = 1;

    return this.update(todo);
  }

  getLastTimestamp(): Observable<number> {
    const query = { limit: 1, order: { by: 'timestamp', type: 'desc' } }; //biggest timestamp
    const filter = { "id": { '>': 0 } }; //dummy filter

    return this.get(filter, query)
      .pipe(map(todos => {
        let timestamp = 0;

        if (todos && todos.length > 0) {
          timestamp = todos[0].timestamp;
        }

        return timestamp;
      }));
  }
}