//import { ActionId } from 'devexpress-reporting/dx-webdocumentviewer'
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import { ReportMovementBudgetsExpensesService } from '../../../adapters/services/reports/report-movement-budgets-expenses.service';
import { ReportMovementBudgetsExpensesModel } from '../../../domain/models/reports/reportMovementBudgetsExpenses.model';
import { DxDataGridModule, DxFormModule  } from 'devextreme-angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-movement-budgets-expenses.component',
  encapsulation: ViewEncapsulation.None,
  imports: [DxDataGridModule, DxFormModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-movement-budgets-expenses.component.html',
  styleUrl: './report-movement-budgets-expenses.component.css'
})
export class ReportMovementBudgetsExpensesComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  reportMovementBudgetsExpenses: ReportMovementBudgetsExpensesModel[] = [];
  stateSortOrder!: string;

  ngOnInit() {
    this.formData = new FormGroup({
      dateBudgetIni: new FormControl(null, [Validators.required]),
      dateBudgetEnd: new FormControl(null, [Validators.required])
    });
  }

  constructor(public reportMovementBudgetsExpensesService: ReportMovementBudgetsExpensesService) { }

  calculateGroupValueExpenseTypeName(this: any, rowData: any) {
    const sortValue = rowData.expenseTypeName != null ? this.sortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.expenseTypeName;
    const displayValue = rowData.expenseTypeName;
    return sortValue + ';' + displayValue;
  }

  calculateGroupValueBudgetName(this: any, rowData: any) {
    const sortValue = rowData.descriptionBudget != null ? this.sortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.descriptionBudget;
    const displayValue = rowData.descriptionBudget;
    return sortValue + ';' + displayValue;
  }

  calculateGroupValueExpenseTypeName2(this: any, rowData: any) {
    const sortValue = rowData.expenseTypeName != null ? this.sortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.expenseTypeName;
    const displayValue = rowData.expenseTypeName;
    return sortValue + ';' + displayValue;
  }

  calculateGroupValueHeaderExpensesName(this: any, rowData: any) {
    const sortValue = rowData.idHeaderExpenses > 0 ? this.sortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.idHeaderExpenses;
    const displayValue = rowData.idHeaderExpenses;
    return sortValue + ';' + displayValue;
  }

  calculateGroupValueDetailExpensesName(this: any, rowData: any) {
    const sortValue = rowData.idDetailExpenses > 0 ? this.sortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.idDetailExpenses;
    const displayValue = rowData.idDetailExpenses;
    return sortValue + ';' + displayValue;
  }

  calculateCellValue(rowData: any) {
    return rowData.State === 'California' ? this.stateSortOrder !== 'desc' ? 'aaa' : 'zzz' : rowData.State;
  }

  ConsultMovementsBudgetsExpenses() {
    if (this.formData.get('dateBudgetIni')!.value != null && this.formData.get('dateBudgetEnd')!.value != null) {     
      this.reportMovementBudgetsExpensesService.getReportMovementBudgetsExpensesService(this.formData.get('dateBudgetIni')!.value, this.formData.get('dateBudgetEnd')!.value)
      .then(({data}) => {  
          this.reportMovementBudgetsExpenses = data;      
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

}
