import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MessageService} from './message.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {GeneratedFee} from '../entity/generatedFee';
import {ReaderService} from './reader.service';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  types: string[] = ['', '', '', '', ''];

  private feeUrl = 'http://localhost:8000/api/fee';

  constructor(private messageService: MessageService, private http: HttpClient, private readerService: ReaderService) { }

  getFee(type: string): Observable<GeneratedFee> {
    const url = this.feeUrl + '/generate';
    type = this.readerService.mapType(type);
    return this.http.get<GeneratedFee>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('type', type)}).pipe(
      catchError(this.handleError<GeneratedFee>('validationObject'))
    );
  }

  private log(message: string) {
    this.messageService.add(`ReaderService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
