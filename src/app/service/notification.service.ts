import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotifyObject } from '../entity/notifyObject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifUrl = 'http://localhost:8000/api/notification';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  notify(notifyObject: NotifyObject): Observable<NotifyObject> {
    return this.http.post<NotifyObject>(this.notifUrl, notifyObject, this.httpOptions).pipe(
      catchError(this.handleError<NotifyObject>('Notification'))
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
