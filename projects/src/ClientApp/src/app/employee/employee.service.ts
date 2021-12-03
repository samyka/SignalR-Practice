import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from './employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesUrl = environment.baseUrl + 'api/v1/Employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEmployee(employeeId: string): Observable<Employee> {
    if (employeeId === '') {
      return of(this.initializeEmployee());
    }
    const url = `${this.employeesUrl}/${employeeId}`;
    return this.http.get<Employee>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Employee>(this.employeesUrl, employee, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEmployee(employeeId: string): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.employeesUrl}/${employeeId}`;
    return this.http.delete<Employee>(url, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    debugger
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.employeesUrl}/${employee.employeeId}`;
    return this.http.put<Employee>(url, employee, { headers: headers })
      .pipe(
        map(() => employee),
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

  private initializeEmployee(): Employee {
    return {
      employeeId: null,
      employeeName: null,
      department: null,
      designation: null,
      gender: null,
      joinDate: null,
      phoneNumber: null
    };
  }
}
