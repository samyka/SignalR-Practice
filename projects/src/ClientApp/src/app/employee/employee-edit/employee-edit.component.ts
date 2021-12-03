import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pageTitle = 'Employee Edit';
  errorMessage: string;
  employeeForm: FormGroup;
  tranMode: string;
  employee: Employee;
  private sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService) {

    this.validationMessages = {
      employeeName: {
        required: 'Employee name is required.',
        minlength: 'Employee name must be at least three characters.',
        maxlength: 'Employee name cannot exceed 50 characters.'
      },
      department: {
        required: 'Employee department name is required.',
      }
    };
  }

  ngOnInit() {
    this.tranMode = "new";
    this.employeeForm = this.fb.group({
      employeeName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
      ]],
      designation: '',
      department: ['', [Validators.required]],
      gender: '',
      joinDate: '',
      phoneNumber: '',
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const employeeId = params.get('employeeId');
        const department = params.get('department');
        if (employeeId == '0') {
          const employee: Employee = {
            employeeId: "0",
            employeeName: "",
            department: "",
            designation: "",
            gender: "",
            joinDate: "",
            phoneNumber: "",

          };
          this.displayEmployee(employee);
        }
        else {
          this.getEmployee(employeeId);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getEmployee(employeeId: string): void {
    this.employeeService.getEmployee(employeeId)
      .subscribe(
        (employee: Employee) => this.displayEmployee(employee),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayEmployee(employee: Employee): void {
    if (this.employeeForm) {
      this.employeeForm.reset();
    }
    this.employee = employee;
    if (this.employee.employeeId == '0') {
      this.pageTitle = 'Add Employee';
    } else {
      this.pageTitle = `Edit Employee: ${this.employee.employeeName}`;
    }
    this.employeeForm.patchValue({
      employeeName: this.employee.employeeName,
      department: this.employee.department,
      designation: this.employee.designation,
      gender: this.employee.gender,
      joinDate: this.employee.joinDate,
      phoneNumber: this.employee.phoneNumber
    });
  }

  deleteEmployee(): void {
    if (this.employee.employeeId == '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${this.employee.employeeName}?`)) {
        this.employeeService.deleteEmployee(this.employee.employeeId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      if (this.employeeForm.dirty) {
        const p = { ...this.employee, ...this.employeeForm.value };
        if (p.employeeId === '') {
          this.employeeService.createEmployee(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.employeeService.updateEmployee(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.employeeForm.reset();
    this.router.navigate(['/employees']);
  }
}
