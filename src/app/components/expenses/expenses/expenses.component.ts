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
import { BusinessModel } from '../../../domain/models/business/business.model';
import { HeaderExpensesModel } from '../../../domain/models/expenses/headerExpenses.model';
import { DocumentTypeModel } from '../../../domain/models/documentType/documentType.model';
import { DetailExpensesModel } from '../../../domain/models/expenses/detailExpenses.model';
import { ExpensesTypeModel } from '../../../domain/models/expenses/expensesType.model';

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
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  loading = false;
  formDataHeader!: FormGroup<any>;
  formDataDetail!: FormGroup<any>;
  headerExpenses: HeaderExpensesModel[] = [];
  detailExpenses: DetailExpensesModel[] = [];
  monetaryFundTypeList: MonetaryFundTypeModel[] = [];
  monetaryFundTypeSelected: MonetaryFundTypeModel | undefined;
  businessList: BusinessModel[] = [];
  businessSelected: BusinessModel | undefined;
  documentTypeList: DocumentTypeModel[] = [];
  documentTypeSelected: DocumentTypeModel | undefined;
  expensesTypeList: ExpensesTypeModel[] = [];
  expensesTypeSelected: ExpensesTypeModel | undefined;
  
  constructor(public expensesService: ExpensesService, private router: Router) { }

  ngOnInit() {

    this.formDataHeader = new FormGroup({
      account: new FormControl(null, [Validators.required]),
      dateExpense: new FormControl(null, [Validators.required]),
      observations: new FormControl(null, [Validators.required]),
      amount: new FormControl(0.00, [Validators.required])
    });

     this.formDataDetail = new FormGroup({
      idHeaderExpenses: new FormControl(null, [Validators.required]),
      amount: new FormControl(0.00, [Validators.required])
    });

    this.headerExpenses = [];
    this.detailExpenses = [];
    this.getHeaderExpenses();

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

    this.businessList = [];

    this.expensesService.getBusinessType().pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
           title: 'An Error Occured!',
           showConfirmButton: false,
           timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          this.businessList = res;
    } });

    this.expensesTypeList = [];

    this.expensesService.getExpensesType().pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
           title: 'An Error Occured!',
           showConfirmButton: false,
           timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          this.expensesTypeList = res;
    } });


  }   

  helloWorld() {
  throw new Error('Method not implemented.');
  }

  saveDetailExpenses() {

    let validationResult = validationEngine.validateGroup("formGroupHeader");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {
      const userId =localStorage.getItem("userId");

      let valueUserId = userId ? JSON.parse(userId) as any : 0;

      const dataHeaderExpenses: HeaderExpensesModel = {
        'idHeaderExpenses': 0,
        'idUser': valueUserId,
        'account': this.formDataHeader.get('account')!.value,
        'dateExpense': this.formDataHeader.get('description')!.value,
        'observations': this.formDataHeader.get('observations')!.value,
        'idBusiness': this.businessSelected?.idBusiness != null ? this.businessSelected?.idBusiness: 0,
        'idMonetaryFundType': this.monetaryFundTypeSelected?.idMonetaryFundType != null ? this.monetaryFundTypeSelected?.idMonetaryFundType : 0,
        'idDocumentType': this.documentTypeSelected?.idDocumentType != null ? this.documentTypeSelected.idDocumentType : 0
      }

      this.expensesService.addHeaderExpenses(dataHeaderExpenses).pipe(
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

  }

  allowUpdatingDetailExpenses(data: HeaderExpensesModel) {

    this.expensesService.updateHeaderExpenses(data).pipe(
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
          title: 'Header Expenses updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
      } 
    });
 

  }

  allowDeletingDetailExpenses(data: HeaderExpensesModel) {

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

        this.expensesService.deleteHeaderExpenses(data.idHeaderExpenses).pipe(
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
            title: 'Header Expenses deleted successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } });
 
      }
    })

  }

  getDetailExpenses() {
    this.expensesService.getHeaderExpensess().subscribe((data) => {
      console.log(data);
      this.headerExpenses = data;
      
    });
  }

  /*Section for Detail Expenses*/

  saveHeaderExpenses() {

    let validationResult = validationEngine.validateGroup("formGroupHeader");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {

      const userId =localStorage.getItem("userId");

      let valueUserId = userId ? JSON.parse(userId) as any : 0;
      
      const dataHeaderExpenses: HeaderExpensesModel = {
        'idHeaderExpenses': 0,
        'idUser': valueUserId,
        'account': this.formDataHeader.get('account')!.value,
        'dateExpense': this.formDataHeader.get('description')!.value,
        'observations': this.formDataHeader.get('observations')!.value,
        'idBusiness': this.businessSelected?.idBusiness != null ? this.businessSelected?.idBusiness: 0,
        'idMonetaryFundType': this.monetaryFundTypeSelected?.idMonetaryFundType != null ? this.monetaryFundTypeSelected?.idMonetaryFundType : 0,
        'idDocumentType': this.documentTypeSelected?.idDocumentType != null ? this.documentTypeSelected.idDocumentType : 0
      }

      this.expensesService.addHeaderExpenses(dataHeaderExpenses).pipe(
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

  }

  allowUpdating(data: HeaderExpensesModel) {

    this.expensesService.updateHeaderExpenses(data).pipe(
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
          title: 'Header Expenses updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
      } 
    });
 

  }

  allowDeleting(data: HeaderExpensesModel) {

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

        this.expensesService.deleteHeaderExpenses(data.idHeaderExpenses).pipe(
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
            title: 'Header Expenses deleted successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } });
 
      }
    })

  }

  getHeaderExpenses() {
    this.expensesService.getHeaderExpensess().subscribe((data) => {
      console.log(data);
      this.headerExpenses = data;
      
    });
  }

  onValueChanged(e: MonetaryFundTypeModel) {
    this.monetaryFundTypeSelected = e;
  }

}
