import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class ReportMovementExecutedTypeExpenseService  {

  getReportMovementExecutedTypeExpenseService(dateBudgetIni: Date, dateBudgetEnd: Date): Promise<any>{
    return axios.get(environment.apiUrl+'/Expenses/GetReportMovementExecutedTypeExpense/'+dateBudgetIni+'/'+dateBudgetEnd);
  }
 
}