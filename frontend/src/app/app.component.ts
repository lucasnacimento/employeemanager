import { Employee } from './employee';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Page } from './pagination/pagination';
import { AlertModalService } from './services/alert-modal.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public employees?: Employee[];
  public editEmployee: Employee | null | undefined;
  public deleteEmployee!: Employee;
  public page!: Page;
  public messageMap? = new Map<string, string>();


  constructor(private employeeService: EmployeeService, private alertService: AlertModalService){
  }

  ngOnInit() {
    this.pagesEmloyees(0, 12);
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public addEmployee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        document.getElementById('add-employee-form')?.click();
        this.alertService.success('Employee created successfully!', "Created");
        this.pagesEmloyees(this.page.number, this.page.size);
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        this.validateFields(error, addForm);
      }
    );
  }

  public updateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        document.getElementById('update-employee-form')?.click();
        this.pagesEmloyees(this.page.number, this.page.size);
        this.alertService.success('Employee data has been updated!', "Updated");
        this.messageMap?.clear();
      },
      (error: HttpErrorResponse) => {
        this.validateFields(error);
      }
    );
  }

  public onDeleteEmployee(idEmployee: number): void {
    this.employeeService.deleteEmployee(idEmployee).subscribe(
      (response: void) => {
        this.pagesEmloyees(this.page.number, this.page.size);
        this.alertService.success('Employee successfully deleted!', "Deleted");
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    if (this.employees !== undefined) {
      for (const iterator of this.employees) {
        if (iterator.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(iterator);
        }
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.pagesEmloyees(this.page.number, this.page.size);
    }
  }

  public pagesEmloyees(page: number, size: number): void {
    this.employeeService.getEmployeesPages(page, size).subscribe(res => {
      this.page = res;
      this.employees = this.page.content;
    });
  }

  public changePage(event: any): void {
    console.log(event);
    this.pagesEmloyees(event.page, event.rows);
  }



  public clearStyleOfFields(addForm: NgForm): void {
      let vetor: Array<string> = addForm.form.value;
      Object.keys(vetor).forEach(e => {
        document.getElementById(e)?.classList.add("ng-valid");
      });
      addForm.reset();
  }

  public validateFields(error: HttpErrorResponse, addForm?: NgForm): void {
    this.messageMap?.clear();
    let vetor: Array<string> = new Array();
    if (addForm instanceof NgForm) {
      vetor = addForm.form.value;
    }else if(this.editEmployee !== null && this.editEmployee !== undefined) {
      vetor = Object.keys(this.editEmployee);
    }

    let array = error.error;
    console.log(array);
    array.forEach((er: any) => {
      this.alertService.danger("","You must fill in the fields correctly.", 8000);
      this.messageMap?.set(er.fieldName, er.messageUser);

    });

    Object.keys(vetor).forEach(e => {
      console.log(e);
      if(this.messageMap?.has(e)){
        document.getElementById(e)?.classList.add("ng-invalid");
      }else{
        document.getElementById(e)?.classList.add("ng-valid");
        document.getElementById(e)?.classList.remove("ng-invalid");
      }
    });

  }


  public openModal(employee: Employee| null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete' && employee !== null) {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

}
