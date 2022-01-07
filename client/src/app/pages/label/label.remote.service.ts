import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Label } from './label.model';

@Injectable({
  providedIn: 'root'
})
export class LabelRemoteService {
  constructor(private httpClient: HttpClient) { }

  get(query?: string): Observable<Label[]> {
    return this.httpClient.get(`${environment.serverApi}/labels${query}`)
      .pipe(map(labels => {
        return (labels as any[]).map(newlabel => {
          const label: Label = {
            createDate: new Date(newlabel.createDate),
            isDeleted: newlabel.isDeleted ? 1 : 0,
            isDirty: 0,
            serverKey: newlabel._id,
            name: newlabel.name,
            timestamp: newlabel.timestamp,
            updateDate: new Date(newlabel.updateDate)
          };

          return label;
        });
      }));
  }

  add(labels: Label[]): Observable<Label[]> {
    return this.httpClient.post<Label[]>(`${environment.serverApi}/labels`, labels);
  }

  update(labels: Label[]): Observable<Label[]> {
    return this.httpClient.put<Label[]>(`${environment.serverApi}/labels`, labels);
  }
}