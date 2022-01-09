import { Injectable } from '@angular/core';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { Syncable } from 'src/app/interface/syncable.interface';
import { LabelLocalService } from './label.local.service';
import { Label } from './label.model';
import { LabelRemoteService } from './label.remote.service';
import { TABLE_NAME_LABEL } from './label.table.model';

@Injectable({
  providedIn: 'root'
})
export class LabelService implements Syncable {
  tableName = TABLE_NAME_LABEL;

  constructor(private labelLocalService: LabelLocalService,
    private labelRemoteService: LabelRemoteService) { }

  get(filter?: any, query?: any): Observable<Label[]> {
    return this.labelLocalService.get(filter, query);
  }

  getById(labelId: number) {
    return this.labelLocalService.getById(labelId);
  }

  add(labels: Label[], changeValues?: boolean): Observable<Label[]> {
    return this.labelLocalService.add(labels, changeValues);
  }

  update(label: Label, changeValues?: boolean): Observable<number> {
    return this.labelLocalService.update(label, changeValues);
  }

  delete(label: Label): Observable<number> {
    return this.labelLocalService.delete(label);
  }

  sync(): Observable<any> {
    return this.getNewsFromRemote()
      .pipe(mergeMap(newLabels => {
        console.log('newLabels', newLabels);

        return this.updateLocalWithRemoteData(newLabels)
          .pipe(mergeMap(() => {
            return this.updateRemoteWithLocalData()
          }));
      }));
  }

  getNewsFromRemote(): Observable<Label[]> {
    return this.labelLocalService.getLastTimestamp()
      .pipe(mergeMap(timestamp => {
        console.log('timestamp', timestamp);

        return this.labelRemoteService.get(`?ts=${timestamp}`)
      }));
  }

  updateLocalWithRemoteData(newLabels: Label[]): Observable<any> {
    const observables = [];

    for (let index = 0; index < newLabels.length; index++) {
      const newLabel = newLabels[index];
      const filter = { serverKey: newLabel.serverKey };

      observables.push(this.get(filter)
        .pipe(mergeMap(labels => {
          if (!labels || labels.length == 0) {
            console.log('newLabel', newLabel);

            return this.add([newLabel], false);
          } else {
            const existLabel = labels[0];

            console.log('existLabel', existLabel);

            if (existLabel.isDirty) {
              console.log('conflict');
            }

            if (newLabel.updateDate > existLabel.updateDate) {
              newLabel.id = existLabel.id;

              return this.update(newLabel, false);
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
      .pipe(mergeMap(dirtyLabels => {
        const labelsToAdd = dirtyLabels.filter(label => !label.serverKey);
        const labelsToUpdate = dirtyLabels.filter(label => label.serverKey);

        console.log('labelsToAdd', labelsToAdd);
        console.log('labelsToUpdate', labelsToUpdate);

        const observables = [];

        if (labelsToUpdate.length > 0) {
          observables.push(this.labelRemoteService.update(labelsToUpdate)
            .pipe(mergeMap((updatedResult => {
              const observables3 = [];

              for (let index = 0; index < updatedResult.length; index++) {
                const updatedLabel = updatedResult[index];

                const updateValue = labelsToUpdate[index];
                updateValue.timestamp = updatedLabel.timestamp;
                updateValue.isDirty = 0;

                observables3.push(this.update(updateValue, false))
              }

              console.log('updatedResult', updatedResult);

              if (observables3.length == 0)
                return of([])

              return forkJoin(observables3);
            }))));
        }

        if (labelsToAdd.length > 0) {
          observables.push(this.labelRemoteService.add(labelsToAdd)
            .pipe(mergeMap((addedResult: any) => {

              const observables2 = [];

              for (let index = 0; index < addedResult.length; index++) {
                const addedLabel = addedResult[index];

                const updateValue = labelsToAdd[index];
                updateValue.serverKey = addedLabel._id;
                updateValue.timestamp = addedLabel.timestamp;
                updateValue.isDirty = 0;

                observables2.push(this.update(updateValue, false))
              }
              console.log('addedResult', addedResult);
              if (observables2.length == 0)
                return of([])
              return forkJoin(observables2);
            })));
        }

        if (observables.length == 0)
          return of([])

        return forkJoin(observables);
      }));
  }
}