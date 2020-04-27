import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FileUpload } from '../entity/uploadFile';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private fileUploadUrl = 'http://localhost:8000/api/uploadFile';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  uploadOneFile(file: File): Observable<FileUpload> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post<FileUpload>(this.fileUploadUrl, formData, { headers }).pipe(
      tap((fileUpload: FileUpload) => this.log(`photo uploaded`)),
      catchError(this.handleError<FileUpload>('fileUpload'))
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
