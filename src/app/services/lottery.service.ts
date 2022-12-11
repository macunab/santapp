import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lottery, ServerResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {

  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }

  makeLottery(lottery: Lottery) {
    const url: string = `${this.baseUrl}/send`;
    return this.http.get<ServerResponse>(url)
      .pipe(
        map( res => res.ok ),
        catchError( error => {
          return of(false);
        })
      )
  }
}
