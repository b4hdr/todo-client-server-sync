// import { Observable } from "rxjs";

// export interface Syncable {
//     sync(): Observable<any>;
// }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class Syncable {
  abstract sync(): Observable<any>;
}