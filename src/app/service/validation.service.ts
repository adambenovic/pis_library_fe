import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {ValidationObject} from '../entity/validationObject';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private validateUrl = 'http://localhost:8000/api/validation';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  validate(validationObject: ValidationObject): Observable<ValidationObject> {
    return this.http.post<ValidationObject>(this.validateUrl, validationObject, this.httpOptions).pipe(
      catchError(this.handleError<ValidationObject>('validationObject'))
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
