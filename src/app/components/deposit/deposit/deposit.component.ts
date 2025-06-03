import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxSelectBoxModule  } from 'devextreme-angular';
import { DepositService } from '../../../adapters/services/deposit/deposit.service';
import { Router } from "@angular/router";
import { DepositModel } from '../../../domain/models/deposit/deposit.model';
import Swal from 'sweetalert2'
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import validationEngine from "devextreme/ui/validation_engine";
import { ExpensesService } from '../../../adapters/services/expenses/expenses.service';
import { MonetaryFundTypeModel } from '../../../domain/models/monetaryFundType/monetaryFundType.model';
import { MatFormFieldModule } from "@angular/material/form-field";

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
        DxNumberBoxModule,
        DxSelectBoxModule, MatFormFieldModule ],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  deposits: DepositModel[] = [];
  monetaryFundTypeList: MonetaryFundTypeModel[] = [];
  monetaryFundTypeSelected: MonetaryFundTypeModel | undefined;

  constructor(public depositService: DepositService, public expensesService: ExpensesService, private router: Router) { }

  ngOnInit() {

    this.formData = new FormGroup({
      account: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      amount: new FormControl(0.00, [Validators.required])
    });

    this.deposits = [];
    this.getBudgets();

    this.monetaryFundTypeList = [];

    this.expensesService.getMonetaryFundType().pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
           title: 'An Error Occured!',
           showConfirmButton: false,
           timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          this.monetaryFundTypeList = res;
    } });

  }   

  helloWorld() {
  throw new Error('Method not implemented.');
  }

  saveDeposit() {

    let validationResult = validationEngine.validateGroup("formGroup");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {

      const userId =localStorage.getItem("userId");
      let valueUserId: number = userId ? JSON.parse(userId) as any : 0;
      
      const dataDeposit: DepositModel = {
        'idDeposit': 0,
        'idUser': valueUserId,
        'account': this.formData.get('account')!.value,
        'date': this.formData.get('date')!.value,
        'amount': this.formData.get('amount')!.value,
        'idMonetaryFundType': this.monetaryFundTypeSelected?.idMonetaryFundType != null ? this.monetaryFundTypeSelected?.idMonetaryFundType : 0
      }

      this.depositService.addDeposit(dataDeposit).pipe(
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

  allowUpdating(data: DepositModel) {

    this.depositService.updateDeposit(data).pipe(
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
          title: 'Deposit updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
      } 
    });
 

  }

  allowDeleting(data: DepositModel) {

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

        this.depositService.deleteDeposit(data.idDeposit).pipe(
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
            title: 'Deposit deleted successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } });
 
      }
    })

  }

  getBudgets() {
    this.depositService.getDeposits().subscribe((data) => {
      console.log(data);
      this.deposits = data;
      
    });
  }

  onValueChanged(e: MonetaryFundTypeModel) {
    this.monetaryFundTypeSelected = e;
  }

}
