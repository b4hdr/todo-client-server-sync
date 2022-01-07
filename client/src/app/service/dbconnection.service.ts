import { Injectable } from '@angular/core';
import { dbConnection } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {
  get connection() {
    return dbConnection;
  }
}
