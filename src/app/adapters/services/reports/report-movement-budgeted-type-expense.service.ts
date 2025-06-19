import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class ReportMovementBudgetedTypeExpenseService  {

  getReportMovementBudgetedTypeExpenseService(dateBudgetIni: Date, dateBudgetEnd: Date): Promise<any>{
    return axios.get(environment.apiUrl+'/Budget/GetReportMovementBudgetedTypeExpense/'+dateBudgetIni+'/'+dateBudgetEnd);
  }
 
}