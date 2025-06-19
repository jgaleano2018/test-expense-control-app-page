import { Injectable } from '@angular/core';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';
import { ExpenseTypeModel } from '../../../domain/models/expenseType/expenseType.model';

@Injectable({ providedIn: 'root' })
export class ExpenseTypeService  {

  getExpensesType(): Promise<any>{
    return axios.get(environment.apiUrl+'/ExpenseType/GetAllExpenseType');
  }

  getExpenseType(id: number): Promise<any>{
    return axios.get(environment.apiUrl+'/Budget/'+id);
  }
 
  addExpenseType(expenseType?: ExpenseTypeModel): Promise<any>{   
    return axios.post(environment.apiUrl+'/ExpenseType', expenseType);
  }
 
  deleteExpenseType(id:number): Promise<any>{
    return axios.delete(environment.apiUrl+'/ExpenseType/' + id);
  }
 
  updateExpenseType(id: number, expenseType: ExpenseTypeModel): Promise<any>{    
    return axios.put(environment.apiUrl+'/ExpenseType/' + id, expenseType);
  }
 
}