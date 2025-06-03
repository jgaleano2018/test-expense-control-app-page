import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule } from 'devextreme-angular';
import { BudgetService } from '../../../adapters/services/budget/budget.service';
import { Router } from "@angular/router";
import { BudgetModel } from '../../../domain/models/budget/budget.model';
import Swal from 'sweetalert2'
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import validationEngine from "devextreme/ui/validation_engine";


@Component({
  selector: 'app-budget',
  imports: [DxButtonModule, 
        DxTextBoxModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule,
      DxNumberBoxModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  budgets: BudgetModel[] = [];

  constructor(public budgetService: BudgetService, private router: Router) { }

  ngOnInit() {

    this.formData = new FormGroup({
      account: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      amount: new FormControl(0.00, [Validators.required])
    });

    this.budgets = [];

    this.getBudgets();

  }   

  helloWorld() {
  throw new Error('Method not implemented.');
  }

  saveBuget() {

    let validationResult = validationEngine.validateGroup("formGroup");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {

      const userId =localStorage.getItem("userId");
      let valueUserId: number = userId ? JSON.parse(userId) as any : 0;
      
      const dataBudget: BudgetModel = {
        'idBudget': 0,
        'idUser': valueUserId,
        'account': this.formData.get('account')!.value,
        'description': this.formData.get('description')!.value,
        'amount': this.formData.get('amount')!.value
      }

      this.budgetService.addBudget(dataBudget).pipe(
          catchError(() => of(
            Swal.fire({
              icon: 'error',
              title: 'An Error Occured!',
              showConfirmButton: false,
              timer: 1500
            })
          )),
          ).subscribe((res: any) => {if(res) {
            Swal.fire({
              icon: 'success',
              title: 'Budget created successfully!',
              showConfirmButton: false,
              timer: 1500
            })

          }
        });

    }

  }

  allowUpdating(data: BudgetModel) {

    this.budgetService.updateBudget(data).pipe(
      catchError(() => of(
        Swal.fire({
          icon: 'error',
          title: 'An Error Occured!',
          showConfirmButton: false,
          timer: 1500
        })
      )),
      ).subscribe((res: any) => {if(res) {
        Swal.fire({
          icon: 'success',
          title: 'Budget updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
      } 
    });
 

  }

  allowDeleting(data: BudgetModel) {

     Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result =>{
      if (result.isConfirmed) {

        this.budgetService.deleteBudget(data.idBudget).pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
           title: 'An Error Occured!',
           showConfirmButton: false,
           timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          Swal.fire({
            icon: 'success',
            title: 'Budget deleted successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } });
 
      }
    })

  }

  getBudgets() {
    this.budgetService.getBudgets().subscribe((data) => {
      console.log(data);
      this.budgets = data;
      
    });
  }

}
