import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReportMovementBudgetsExpensesService } from '../../../adapters/services/reports/report-movement-budgets-expenses.service';
import { ReportMovementBudgetsExpensesModel } from '../../../domain/models/reports/reportMovementBudgetsExpenses.model';
import { DxDataGridModule, DxFormModule  } from 'devextreme-angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DxChartModule } from 'devextreme-angular';
import { ReportMovementBudgetedTypeExpenseService } from '../../../adapters/services/reports/report-movement-budgeted-type-expense.service';
import { ReportMovementExecutedTypeExpenseService } from '../../../adapters/services/reports/report-movement-executed-type-expense.service';
import { ReportMovementBudgetedTypeExpense } from '../../../domain/models/reports/reportMovementBudgetedTypeExpense';
import { ReportMovementExecutedTypeExpense } from '../../../domain/models/reports/reportMovementExecutedTypeExpense';
import { GrossReportBudgetedExpensesModel } from '../../../domain/models/reports/grossReportBudgetedExpenses';
import { GrossReportExecutedExpensesModel } from '../../../domain/models/reports/grossReportExecutedExpenses';

@Component({
  selector: 'app-chart-budgeted-and-executed-by-expense-type',
  encapsulation: ViewEncapsulation.None,
  imports: [DxDataGridModule, DxFormModule, DxChartModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chart-budgeted-and-executed-by-expense-type.html',
  styleUrl: './chart-budgeted-and-executed-by-expense-type.css'
})
export class ChartBudgetedAndExecutedByExpenseType implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  reportMovementBudgetedTypeExpense: ReportMovementBudgetedTypeExpense[] = [];
  reportMovementExecutedTypeExpense: ReportMovementExecutedTypeExpense[] = [];
  grossReportBudgetedExpenses: GrossReportBudgetedExpensesModel[] = [];
  grossReportExecutedExpensesModel: GrossReportExecutedExpensesModel[] = []
  
  
  stateSortOrder!: string;

  ngOnInit() {

    this.formData = new FormGroup({
      dateBudgetIni: new FormControl(null, [Validators.required]),
      dateBudgetEnd: new FormControl(null, [Validators.required])
    });

  }

  constructor(public reportMovementBudgetsExpensesService: ReportMovementBudgetsExpensesService, 
              public reportMovementBudgetedTypeExpenseService: ReportMovementBudgetedTypeExpenseService,
              public reportMovementExecutedTypeExpenseService: ReportMovementExecutedTypeExpenseService) { 

      this.reportMovementBudgetedTypeExpense = [];
      this.reportMovementExecutedTypeExpense = [];
      this.grossReportBudgetedExpenses = [];
      this.grossReportExecutedExpensesModel = [];
  }

  getDataChartBudgetedAndExecutedByExpenseType() {

    if (this.formData.get('dateBudgetIni')!.value != null && this.formData.get('dateBudgetEnd')!.value != null) {
      
      this.reportMovementBudgetedTypeExpenseService.getReportMovementBudgetedTypeExpenseService(this.formData.get('dateBudgetIni')!.value, this.formData.get('dateBudgetEnd')!.value)
      .then(({data}) => {  
        console.log(data);
  
          this.reportMovementBudgetedTypeExpense = data;

          let arrayExpenseType: string[] = [];
          let arrayDateBudgeted: Date[] = [];

          for (let idx=0; idx<this.reportMovementBudgetedTypeExpense.length; idx++) {

            if (arrayExpenseType.length>0) {

              let existsET = false;
              for (let idx2=0; idx2<arrayExpenseType.length; idx2++) {

                if (arrayExpenseType[idx2] == this.reportMovementBudgetedTypeExpense[idx].expenseTypeName) {
                  existsET = true;
                }

              }

              if (!existsET) {
                arrayExpenseType.push(this.reportMovementBudgetedTypeExpense[idx].expenseTypeName);
              }

            }
            else {
              arrayExpenseType.push(this.reportMovementBudgetedTypeExpense[idx].expenseTypeName);
            }

            if (arrayDateBudgeted.length>0) {

              let existsET = false;
              for (let idx2=0; idx2<arrayDateBudgeted.length; idx2++) {

                if (arrayDateBudgeted[idx2] == this.reportMovementBudgetedTypeExpense[idx].dateBudget) {
                  existsET = true;
                }

              }

              if (!existsET) {
                arrayDateBudgeted.push(this.reportMovementBudgetedTypeExpense[idx].dateBudget);
              }

            }
            else {
              arrayDateBudgeted.push(this.reportMovementBudgetedTypeExpense[idx].dateBudget);
            }
          }


          let totalAmountByExpenses;

          for (let idx=0; idx<arrayExpenseType.length; idx++) {

            for (let idx2=0; idx2<arrayDateBudgeted.length; idx2++) {

              totalAmountByExpenses = 0;

              for (let idx3=0; idx3<this.reportMovementBudgetedTypeExpense.length; idx3++) {

                if (this.reportMovementBudgetedTypeExpense[idx3].expenseTypeName == arrayExpenseType[idx] && this.reportMovementBudgetedTypeExpense[idx3].dateBudget == arrayDateBudgeted[idx2]) {

                  totalAmountByExpenses = totalAmountByExpenses + this.reportMovementBudgetedTypeExpense[idx3].amountBudget;

                }

              }

              this.grossReportBudgetedExpenses.push({ "expenseTypeName": arrayExpenseType[idx], "dateBudget": arrayDateBudgeted[idx2], "totalBudgetedByDate": totalAmountByExpenses })

            }

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


      this.reportMovementExecutedTypeExpenseService.getReportMovementExecutedTypeExpenseService(this.formData.get('dateBudgetIni')!.value, this.formData.get('dateBudgetEnd')!.value)
      .then(({data}) => { 
        console.log(data);
  
          this.reportMovementExecutedTypeExpense = data;
  
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

  customizeSeries(valueFromNameField: number) {
    return valueFromNameField === 2009
      ? { type: 'line', label: { visible: true }, color: '#ff3f7a' } : {};
  }


  onPointClick(e: any) {
    e.target.select();
  }


}
