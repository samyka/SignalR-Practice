import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  pageTitle = 'Employee List';
  filteredEmployees: Employee[] = [];
  employees: Employee[] = [];
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredEmployees = this.listFilter ? this.performFilter(this.listFilter) : this.employees;
  }

  private connection: signalR.HubConnection;

  constructor(private employeeService: EmployeeService) { }

  performFilter(filterBy: string): Employee[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.employees.filter((employee: Employee) =>
      employee.employeeName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  ngOnInit(): void {
    this.getEmployeeData();

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.baseUrl + 'notify')
      .build();

      this.connection.start().then(function () {
      console.log('SignalR Connected succefully!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.connection.on("NotificationsHub", () => {
      this.getEmployeeData();
    });
  }

  getEmployeeData() {
    this.employeeService.getEmployees().subscribe(
      employees => {
        this.employees = employees;
        this.filteredEmployees = this.employees;
      },
      error => this.errorMessage = <any>error
    );
  }

  deleteEmployee(employeeId: string, employeeName: string): void {
    if (employeeId === '') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${employeeName}?`)) {
        this.employeeService.deleteEmployee(employeeId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  onSaveComplete(): void {
    this.employeeService.getEmployees().subscribe(
      employees => {
        this.employees = employees;
        this.filteredEmployees = this.employees;
      },
      error => this.errorMessage = <any>error
    );
  }

}
