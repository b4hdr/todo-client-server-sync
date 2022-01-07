import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITodo } from './todo.model';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoRemoteService {
  constructor(private httpClient: HttpClient) { }

  get(query?: string): Observable<ITodo[]> {
    return this.httpClient.get(`${environment.serverApi}/todos${query}`)
      .pipe(map(todos => {
        return (todos as any[]).map(newtodo => {
          const todo: ITodo = {
            createDate: new Date(newtodo.createDate),
            description: newtodo.description,
            isCompleted: newtodo.isCompleted ? 1 : 0,
            isDeleted: newtodo.isDeleted ? 1 : 0,
            isDirty: 0,
            serverKey: newtodo._id,
            summary: newtodo.summary,
            timestamp: newtodo.timestamp,
            updateDate: new Date(newtodo.updateDate)
          };

          return todo;
        });
      }));
  }

  add(todos: ITodo[]): Observable<ITodo[]> {
    return this.httpClient.post<ITodo[]>(`${environment.serverApi}/todos`, todos);
  }

  update(todos: ITodo[]): Observable<ITodo[]> {
    return this.httpClient.put<ITodo[]>(`${environment.serverApi}/todos`, todos);
  }
}