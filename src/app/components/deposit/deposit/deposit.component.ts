import { afterNextRender, Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxToolbarModule, 
  DxDataGridComponent, DxSelectBoxModule, DxDropDownBoxModule, DxListModule} from 'devextreme-angular';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { DepositService } from '../../../adapters/services/deposit/deposit.service';
import { Router } from "@angular/router";
import { DepositModel } from '../../../domain/models/deposit/deposit.model';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MonetaryFundTypeModel } from '../../../domain/models/monetaryFundType/monetaryFundType.model';
import { ExpensesService } from '../../../adapters/services/expenses/expenses.service';


@Component({
  selector: 'app-deposit',
  imports: [DxButtonModule, 
        DxTextBoxModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule,
        DxNumberBoxModule,
        DxToolbarModule,
        DxSelectBoxModule, DxDropDownBoxModule, DxListModule,
      MatFormFieldModule, MatInputModule, MatSelectModule, DatePipe, CommonModule,
    ReactiveFormsModule, FormsModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  deposits: DepositModel[] = [];
  monetaryFundTypeList: MonetaryFundTypeModel[] = [];
  monetaryFundTypeSelected: MonetaryFundTypeModel | undefined;
  depositModelVal: DepositModel | undefined;
  isDropDownBoxOpened = false;
  monetaryFundTypeId: any;
  userIdValue: number = 0;

  @ViewChild("mainGrid", { static: false }) mainGrid: any = DxDataGridComponent;
  title = 'deposit';
  allValid: any;
  subjects: any = [];
  rowData: any = [];

  constructor(public depositService: DepositService, public expensesService: ExpensesService, private router: Router) { 

    afterNextRender(() => {
      const userId =localStorage.getItem("userId");
      this.userIdValue = userId ? JSON.parse(userId) as any : 0;
    });
  }

  ngOnInit() {
    this.formData = new FormGroup({
      monetaryFundType: new FormControl(null, [Validators.required])
    });
    this.deposits = [];
    this.monetaryFundTypeList = [];
    this.getdeposits();
    this.getMonetaryFundType();
  }   

  onEditingStart(e: any) {
    this.rowData["key"] = e.key;
  }

  onEditorPreparing(e: any) {
    if (e.dataField === "idDeposit" && e.parentType === "dataRow") {
      this.rowData["idDeposit"] = e.row.data.idDeposit;
      this.allValid = !e.row.data.idDeposit || e.row.data.idDeposit === "" && e.row.data.hasOwnProperty("idDeposit");
    }
  }

  setCellValue(newData: any, value: any) {   
    let column = (<any>this);
    column.defaultSetCellValue(newData, value);    
  }

  saveButton = () => {  
    this.mainGrid.instance.saveEditData();
    this.mainGrid.instance.refresh();
  }

  cancelButton = () => {
    this.mainGrid.instance.cancelEditData();
  }

  onRowValidating(e: any) {
    let monetaryFundTypeId = this.formData.get('monetaryFundType')!.value

    const depositModelValLoc: DepositModel = {
      "idDeposit": 0,
      "idUser": this.userIdValue,
      "account": e.newData.account,
      "date": e.newData.Date,
      "amount": e.newData.amount,
      "idMonetaryFundType": monetaryFundTypeId.idMonetaryFundType,
      "key": 0,
      "type": 'insert'
    };
    
    this.depositModelVal = depositModelValLoc;
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemoved(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })
  }

  onSaving(e: any) {
    let continueProccess = false;
    if (this.userIdValue>=0) {

      try {

        if (this.rowData["key"].idDeposit != null && this.rowData["key"].idDeposit != undefined) {
          let depositModelValLoc: DepositModel;
          if (e.changes[0]) {
            depositModelValLoc = { 
              "idDeposit": e.changes[0].data.idDeposit != undefined ? e.changes[0].data.idDeposit : this.rowData["key"].idDeposit,
              "idUser": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowData["key"].idUser,
              "account": e.changes[0].data.account != undefined ? e.changes[0].data.account : this.rowData["key"].account,
              "date": e.changes[0].data.date != undefined ? e.changes[0].data.date : this.rowData["key"].date,
              "amount": e.changes[0].data.amount != undefined ? e.changes[0].data.amount : this.rowData["key"].amount,
              "idMonetaryFundType": e.changes[0].data.idMonetaryFundType != undefined ? e.changes[0].data.idMonetaryFundType : this.rowData["key"].idMonetaryFundType,
              "key": e.changes[0].data.key != undefined ? e.changes[0].data.key : this.rowData["key"].key,
              "type": "update"
            };
            e.changes[0] = {       
              idDeposit: this.rowData["key"].idDeposit,
              idUser: this.rowData["key"].idUser,
              account: this.rowData["key"].account,
              date: this.rowData["key"].date,
              amount: this.rowData["key"].amount,
              idMonetaryFundType: this.rowData["key"].idMonetaryFundType,
              key: this.rowData["key"].key,
              type: "update"
            }
          } else {
            depositModelValLoc = { 
              "idDeposit": this.rowData["key"].idDeposit,
              "idUser": this.rowData["key"].idUser,
              "account": this.rowData["key"].account,
              "date": this.rowData["key"].date,
              "amount": this.rowData["key"].amount,
              "idMonetaryFundType": this.rowData["key"].idMonetaryFundType,
              "key": this.rowData["key"].key,
              "type": "update"
            };
            e.changes.push({
              idDeposit: this.rowData["key"].idDeposit,
              idUser: this.rowData["key"].idUser,
              account: this.rowData["key"].account,
              date: this.rowData["key"].date,
              amount: this.rowData["key"].amount,
              idMonetaryFundType: this.rowData["key"].idMonetaryFundType,
              key: this.rowData["key"].key,
              type: "update"
            })
          }

          this.depositModelVal = depositModelValLoc;
          if (this.depositModelVal) {
            this.depositService.updateDeposit(this.depositModelVal.idDeposit, this.depositModelVal)
            .then(({data}) => {    
              Swal.fire({
                icon: 'success',
                title: 'Deposit updated successfully!',
                showConfirmButton: false,
                timer: 1500
              })
            }).catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
              })
              return error
            });
          }
        }
        else {
          continueProccess = true;          
        }
      }
      catch(e) {
        continueProccess = true;
      }

      if (continueProccess) {

          try {
            if (this.monetaryFundTypeId.idMonetaryFundType != undefined) {}
          }
          catch(e) {
            Swal.fire({
              icon: 'error',
              title: 'Error. You should to select a Monetary Fund Type.',
              showConfirmButton: false,
              timer: 1500
            });
          }

          if (this.monetaryFundTypeId.idMonetaryFundType>0) {
            this.depositService.addDeposit(this.depositModelVal)
            .then(({data}) => {    
              Swal.fire({
                icon: 'success',
                title: 'Deposit created successfully!',
                showConfirmButton: false,
                timer: 1500
              })
            }).catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
              })
              return error
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error. You should to select a Monetary Fund Type.',
              showConfirmButton: false,
              timer: 1500
            });
          }
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error. The user must log in before recording a deposit.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  getdeposits() {
    this.depositService.getDeposits()
    .then(({data}) => {   
      let depositsTempSingle: DepositModel;      
      for (let i=0; i<data.length; i++) {
        console.log(data[i]);
        depositsTempSingle = data[i];
        depositsTempSingle.key = data[i].idDeposit;
        depositsTempSingle.type = "array";
        this.deposits.push(depositsTempSingle);
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  getMonetaryFundType() {
    this.expensesService.getMonetaryFundType()
    .then(({data}) => { 
      this.monetaryFundTypeList = data;
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  onSubmit() {
    this.monetaryFundTypeId = this.formData.get('monetaryFundType')!.value;
  }
  
}
