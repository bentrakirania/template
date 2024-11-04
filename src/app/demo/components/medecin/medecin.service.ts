import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class MedecinService {
  private apiUrl = 'http://localhost:8082/clinique/medecins';

  constructor(private http: HttpClient) {}

  // Method to get data from the API
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message
    return throwError(() => 'Something Wrong Happened, Try Again Sometime in the future!');
  }
}
