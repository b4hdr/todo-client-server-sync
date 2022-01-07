import { Injectable } from '@angular/core';
import { ITodo } from './todo.model';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { TABLE_NAME_TODO } from './todo.table.model';
import { Syncable } from 'src/app/interface/syncable.interface';
import { TodoLocalService } from './todo.local.service';
import { TodoRemoteService } from './todo.remote.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService implements Syncable {
  tableName = TABLE_NAME_TODO;

  constructor(private todoLocalService: TodoLocalService,
    private todoRemoteService: TodoRemoteService) { }

  get(filter?: any, query?: any): Observable<ITodo[]> {
    return this.todoLocalService.get(filter, query);
  }

  getById(todoId: number) {
    return this.todoLocalService.getById(todoId);
  }

  add(todos: ITodo[], changeValues?: boolean): Observable<ITodo[]> {
    return this.todoLocalService.add(todos, changeValues);
  }

  update(todo: ITodo, changeValues?: boolean): Observable<number> {
    return this.todoLocalService.update(todo, changeValues);
  }

  delete(todo: ITodo): Observable<number> {
    return this.todoLocalService.delete(todo);
  }

  toggleTodoState(todo: ITodo): Observable<number> {
    todo.isCompleted = 1 - todo.isCompleted;

    return this.update(todo);
  }

  sync(): Observable<any> {
    return this.getNewsFromRemote()
      .pipe(mergeMap(newTodos => {
        console.log('newTodos', newTodos);

        return this.updateLocalWithRemoteData(newTodos)
          .pipe(mergeMap(() => {
            return this.updateRemoteWithLocalData()
          }));
      }));
  }

  getNewsFromRemote(): Observable<ITodo[]> {
    return this.todoLocalService.getLastTimestamp()
      .pipe(mergeMap(timestamp => {
        console.log('timestamp', timestamp);

        return this.todoRemoteService.get(`?ts=${timestamp}`)
      }));
  }

  updateLocalWithRemoteData(newTodos: ITodo[]): Observable<any> {
    const observables = [];

    for (let index = 0; index < newTodos.length; index++) {
      const newTodo = newTodos[index];
      const filter = { serverKey: newTodo.serverKey };

      observables.push(this.get(filter)
        .pipe(mergeMap(todos => {
          if (!todos || todos.length == 0) {
            console.log('newTodo', newTodo);

            return this.add([newTodo], false);
          } else {
            const existTodo = todos[0];

            console.log('existTodo', existTodo);

            if (existTodo.isDirty) {
              console.log('conflict');
            }

            if (newTodo.updateDate > existTodo.updateDate) {
              newTodo.id = existTodo.id;

              return this.update(newTodo, false);
            }

            return of([]);
          }
        })));
    }

    if (observables.length == 0)
      return of([])

    return forkJoin(observables);
  }

  updateRemoteWithLocalData() {
    const filter = { isDirty: 1 };

    return this.get(filter)
      .pipe(mergeMap(dirtyTodos => {
        const todosToAdd = dirtyTodos.filter(todo => !todo.serverKey);
        const todosToUpdate = dirtyTodos.filter(todo => todo.serverKey);

        console.log('todosToAdd', todosToAdd);
        console.log('todosToUpdate', todosToUpdate);

        const observables = [];

        observables.push(this.todoRemoteService.update(todosToUpdate)
          .pipe(mergeMap((updatedResult => {
            const observables3 = [];

            for (let index = 0; index < updatedResult.length; index++) {
              const updatedTodo = updatedResult[index];

              const updateValue = todosToUpdate[index];
              updateValue.timestamp = updatedTodo.timestamp;
              updateValue.isDirty = 0;

              observables3.push(this.update(updateValue, false))
            }

            console.log('updatedResult', updatedResult);

            if (observables3.length == 0)
              return of([])

            return forkJoin(observables3);
          }))));

        observables.push(this.todoRemoteService.add(todosToAdd)
          .pipe(mergeMap((addedResult: any) => {

            const observables2 = [];

            for (let index = 0; index < addedResult.length; index++) {
              const addedTodo = addedResult[index];

              const updateValue = todosToAdd[index];
              updateValue.serverKey = addedTodo._id;
              updateValue.timestamp = addedTodo.timestamp;
              updateValue.isDirty = 0;

              observables2.push(this.update(updateValue, false))
            }
            console.log('addedResult', addedResult);
            if (observables2.length == 0)
              return of([])
            return forkJoin(observables2);
          })));

        if (observables.length == 0)
          return of([])

        return forkJoin(observables);
      }));
  }
}