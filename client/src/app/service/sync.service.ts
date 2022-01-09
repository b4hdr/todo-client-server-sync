import { Injectable } from '@angular/core';
import { concat, Observable, tap, toArray } from 'rxjs';
import { Syncable } from 'src/app/interface/syncable.interface';
import { TodoService } from '../pages/todo/todo.service';
import { LabelService } from '../pages/label/label.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService implements Syncable {
  private syncableServices: Syncable[];

  constructor(private todoService: TodoService,
    private labelService: LabelService) {

    this.syncableServices = [this.labelService, this.todoService];
  }

  sync(): Observable<any> {
    const observables = this.syncableServices.map(service => service.sync());

    return concat(...observables)
      .pipe(
        toArray(),
        tap(data => console.log(data))
      );
  }
}