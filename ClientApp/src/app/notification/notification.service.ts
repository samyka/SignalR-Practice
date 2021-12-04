import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NotificationCounter, NotificationMessage } from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsUrl = environment.baseUrl +'api/v1/Notifications';

  constructor(private http: HttpClient) { }

  getNotificationCount(): Observable<NotificationCounter> {
    const url = `${this.notificationsUrl}/notificationcounter`;
    return this.http.get<NotificationCounter>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getNotificationMessage(): Observable<Array<NotificationMessage>> {
    const url = `${this.notificationsUrl}/notificationmessage`;
    return this.http.get<Array<NotificationMessage>>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteNotifications(): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.notificationsUrl}/deletenotifications`;
    return this.http.delete(url, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
