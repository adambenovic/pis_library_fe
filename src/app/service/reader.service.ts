import { Injectable } from '@angular/core';
import { Reader } from '../entity/reader';
import {Observable, of } from 'rxjs';
import { MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {ReaderList} from '../entity/readerList';
import {Fee} from '../entity/fee';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private readersUrl = 'http://localhost:8000/api/readers';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getReaders(): Observable<Reader[]> {
    this.messageService.add('ReaderService: fetched readers');
    return this.http.get<ReaderList>(this.readersUrl)
      .pipe(
        map(response => response._embedded.readerList),
        tap(_ => this.log('fetched readers')),
        catchError(this.handleError<Reader[]>('getReaders', []))
      );
  }

  getReader(id: number): Observable<Reader> {
    const url = `${this.readersUrl}/${id}`;
    return this.http.get<Reader>(url).pipe(
      tap(_ => this.log(`fetched reader id=${id}`)),
      catchError(this.handleError<Reader>(`getReader id=${id}`))
    );
  }

  getReaderFees(id: number): Observable<Fee[]> {
    const url = `${this.readersUrl}/${id}/fee`;
    return this.http.get<Fee[]>(url).pipe(
      tap(_ => this.log(`fetched reader id=${id} fees`)),
      catchError(this.handleError<Fee[]>(`getReaderFees id=${id}`))
    );
  }

  addReader(reader: Reader): Observable<Reader> {
    this.messageService.add('Added readers' + JSON.stringify(reader));

    return this.http.post<Reader>(this.readersUrl, reader, this.httpOptions).pipe(
      tap((newReader: Reader) => this.log(`added readers w/ id=${reader.id}`)),
      catchError(this.handleError<Reader>('addReader'))
    );
  }

  updateReader(reader: Reader): Observable<any> {
    const url = `${this.readersUrl}/${reader.id}`;
    return this.http.put(url, reader, this.httpOptions).pipe(
      tap(_ => this.log(`updated reader id=${reader.id}`)),
      catchError(this.handleError<any>('updateReader'))
    );
  }

  deleteReader(reader: Reader | number): Observable<Reader> {
    const id = typeof reader === 'number' ? reader : reader.id;
    const url = `${this.readersUrl}/${id}`;

    return this.http.delete<Reader>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted reader id=${id}`)),
      catchError(this.handleError<Reader>('deleteReader'))
    );
  }

  mapType(type) {
    switch (type) {
      case 'Dospelý':
        type = 'adult';
        break;
      case 'Študent(držiteľ ISIC karty)':
        type = 'student';
        break;
      case 'Dieťa(do 15 rokov)':
        type = 'kid';
        break;
      case 'ZŤP':
        type = 'ztp';
        break;
      case 'Dôchodca':
        type = 'retiree';
        break;
    }

    return type;
  }

  reMapType(type) {
    switch (type) {
      case 'adult':
        type = 'Dospelý';
        break;
      case 'student':
        type = 'Študent(držiteľ ISIC karty)';
        break;
      case 'kid':
        type = 'Dieťa(do 15 rokov)';
        break;
      case 'ztp':
        type = 'ZŤP';
        break;
      case 'retiree':
        type = 'Dôchodca';
        break;
    }

    return type;
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
