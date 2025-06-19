import { Injectable } from '@angular/core';
import { BudgetModel } from '../../../domain/models/budget/budget.model';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class BudgetService  {

  getBudgets(): Promise<any>{
    return axios.get(environment.apiUrl+'/Budget/GetAllBudget');
  }

  getBudget(id: number): Promise<any>{
    return axios.get(environment.apiUrl+'/Budget/'+id);
  }
 
  addBudget(budget?: BudgetModel): Promise<any>{   
    return axios.post(environment.apiUrl+'/Budget', budget);
  }
 
  deleteBudget(id:number): Promise<any>{
    return axios.delete(environment.apiUrl+'/budget/' + id);
  }
 
  updateBudget(id: number, budget: BudgetModel): Promise<any>{    
    return axios.put(environment.apiUrl+'/Budget/' + id, budget);
  }

 
}