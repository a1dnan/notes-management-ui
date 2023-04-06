import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse } from '../interfaces/custom-http-response';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private readonly server = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // reactive approach
  notes$ = <Observable<CustomHttpResponse>>this.http
  .get<CustomHttpResponse>(`${this.server}/note`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  save$ = (note: Note) => <Observable<CustomHttpResponse>>this.http
  .post<CustomHttpResponse>(`${this.server}/note`, note)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  update$ = (note: Note) => <Observable<CustomHttpResponse>>this.http
  .put<CustomHttpResponse>(`${this.server}/note`, note)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  delete$ = (noteId: number) => <Observable<CustomHttpResponse>>this.http
  .delete<CustomHttpResponse>(`${this.server}/note/${noteId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.log(err);
    let errorMessage : string;
    if(err.error instanceof ErrorEvent){

      errorMessage = `A client error occurred - ${err.error.message}`
      
    }else{

      if(err.error.reason){

        errorMessage = `${err.error.reason} - Error code ${err.status}`

      }else{

        errorMessage = `An error occurred - Error code ${err.status}`

      }
    }
  
    return throwError(errorMessage);
    //return throwError(() => errorMessage);
  }
}
