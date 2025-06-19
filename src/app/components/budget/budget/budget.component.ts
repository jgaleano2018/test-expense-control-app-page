import { afterNextRender, Component, OnInit, ViewChild  } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxToolbarModule, 
  DxDataGridComponent, DxSelectBoxModule, DxDropDownBoxModule, DxListModule} from 'devextreme-angular';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { BudgetService } from '../../../adapters/services/budget/budget.service';
import { Router } from "@angular/router";
import { BudgetModel } from '../../../domain/models/budget/budget.model';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseTypeModel } from '../../../domain/models/expenseType/expenseType.model';
import { ExpenseTypeService } from '../../../adapters/services/expenseType/expenseType.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';


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
        DxToolbarModule,
        DxSelectBoxModule, DxDropDownBoxModule, DxListModule,
      MatFormFieldModule, MatInputModule, MatSelectModule, DatePipe, CommonModule,
    ReactiveFormsModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  budgets: BudgetModel[] = [];
  expensesTypeList: ExpenseTypeModel[] = [];
  expensesTypeSelected?: ExpenseTypeModel;
  budgetModelVal: BudgetModel | undefined;
  isDropDownBoxOpened = false;
  expensesTypeId: any;
  userIdValue: number = 0;

  @ViewChild("mainGrid", { static: false }) mainGrid: any = DxDataGridComponent;
  title = 'budget';
  allValid: any;
  subjects: any = [];
  rowData: any = [];

  constructor(public budgetService: BudgetService, public expenseTypeService: ExpenseTypeService, private router: Router) {
    afterNextRender(() => {
      const userId =localStorage.getItem("userId");
      this.userIdValue = userId ? JSON.parse(userId) as any : 0;
    });
  }
 
  ngOnInit() {
    this.formData = new FormGroup({
      expenseType: new FormControl(null, [Validators.required])
    });
    this.budgets = [];
    this.expensesTypeList = [];
    this.getBudgets();
    this.getExpensesType();
  }   

  onEditingStart(e: any) {
    this.rowData["key"] = e.key;
  }
  onEditorPreparing(e: any) {
    if (e.dataField === "idBudget" && e.parentType === "dataRow") {
      this.rowData["idBudget"] = e.row.data.idBudget;
      this.allValid = !e.row.data.idBudget || e.row.data.idBudget === "" && e.row.data.hasOwnProperty("idBudget");
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
    let expensesTypeId = this.formData.get('expenseType')!.value

    const budgetModelValLoc: BudgetModel = {
      "idBudget": 0,
      "idUser": this.userIdValue,
      "account": e.newData.account,
      "description": e.newData.description,
      "amount": e.newData.amount,
      "dateBudget": e.newData.dateBudget,
      "idExpenseType": expensesTypeId.idExpenseType,
      "key": 0,
      "type": 'insert'
    };
    
    this.budgetModelVal = budgetModelValLoc;
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemoved(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })

  }

  onSaving(e: any) {
    let continueProccess = false;
    if (this.userIdValue>0) {

      try {
        if (this.rowData["key"].idBudget != null && this.rowData["key"].idBudget != undefined) {
          let budgetModelValLoc: BudgetModel;
          if (e.changes[0]) {
            budgetModelValLoc = { 
              "idBudget": e.changes[0].data.idBudget != undefined ? e.changes[0].data.idBudget : this.rowData["key"].idBudget,
              "idUser": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowData["key"].idUser,
              "account": e.changes[0].data.account != undefined ? e.changes[0].data.account : this.rowData["key"].account,
              "description": e.changes[0].data.description != undefined ? e.changes[0].data.description : this.rowData["key"].description,
              "amount": e.changes[0].data.amount != undefined ? e.changes[0].data.amount : this.rowData["key"].amount,
              "dateBudget": e.changes[0].data.dateBudget != undefined ? e.changes[0].data.dateBudget : this.rowData["key"].dateBudget,
              "idExpenseType": e.changes[0].data.idExpenseType != undefined ? e.changes[0].data.idExpenseType : this.rowData["key"].idExpenseType,
              "key": e.changes[0].data.key != undefined ? e.changes[0].data.key : this.rowData["key"].key,
              "type": "update"
            };
            e.changes[0] = {       
              idBudget: this.rowData["key"].idBudget,
              idUser: this.rowData["key"].idUser,
              account: this.rowData["key"].account,
              description: this.rowData["key"].description,
              amount: this.rowData["key"].amount,
              dateBudget: this.rowData["key"].dateBudget,
              idExpenseType: this.rowData["key"].idExpenseType,
              key: this.rowData["key"].key,
              type: "update"
            }
          } else {
            budgetModelValLoc = { 
              "idBudget": this.rowData["key"].idBudget,
              "idUser": this.rowData["key"].idUser,
              "account": this.rowData["key"].account,
              "description": this.rowData["key"].description,
              "amount": this.rowData["key"].amount,
              "dateBudget": this.rowData["key"].dateBudget,
              "idExpenseType": this.rowData["key"].idExpenseType,
              "key": this.rowData["key"].key,
              "type": "update"
            };
            e.changes.push({
              idBudget: this.rowData["key"].idBudget,
              idUser: this.rowData["key"].idUser,
              account: this.rowData["key"].account,
              description: this.rowData["key"].description,
              amount: this.rowData["key"].amount,
              dateBudget: this.rowData["key"].dateBudget,
              idExpenseType: this.rowData["key"].idExpenseType,
              key: this.rowData["key"].key,
              type: "update"
            })
          }

          this.budgetModelVal = budgetModelValLoc;
          if (this.budgetModelVal) {
            this.budgetService.updateBudget(this.budgetModelVal.idBudget, this.budgetModelVal)
            .then(({data}) => {  
              Swal.fire({
                icon: 'success',
                title: 'Budget updated successfully!',
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
          if (this.expensesTypeId.idExpenseType != undefined) {}
        }
        catch(e) {
          Swal.fire({
            icon: 'error',
            title: 'Error. You should to select a Expense Type.',
            showConfirmButton: false,
            timer: 1500
          });
        }

        if (this.expensesTypeId.idExpenseType>0) {
          this.budgetService.addBudget(this.budgetModelVal)
          .then(({data}) => {    
            Swal.fire({
              icon: 'success',
              title: 'Budget created successfully!',
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
            title: 'Error. You should to select a Expenses Type.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    }
     else {
        Swal.fire({
          icon: 'error',
          title: 'Error. The user must log in before recording a budget.',
          showConfirmButton: false,
          timer: 1500
        });
      }
  }

  getBudgets() {
    this.budgetService.getBudgets()
    .then(({data}) => {   
      let budgetsTempSingle: BudgetModel;      
      for (let i=0; i<data.length; i++) {
        budgetsTempSingle = data[i];
        budgetsTempSingle.key = data[i].idBudget;
        budgetsTempSingle.type = "array";
        this.budgets.push(budgetsTempSingle);
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

  getExpensesType() {
    this.expenseTypeService.getExpensesType()
    .then(({data}) => {     
      this.expensesTypeList = data;
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
    this.expensesTypeId = this.formData.get('expenseType')!.value;
  }

}
