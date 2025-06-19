import { Injectable } from '@angular/core';
import { DepositModel } from '../../../domain/models/deposit/deposit.model';
import { environment } from '../../../environtments/environtment.development';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class DepositService  {

  getDeposits(): Promise<any>{
    return axios.get(environment.apiUrl+'/Deposit');
  }

  getDeposit(id: number): Promise<any>{
    return axios.get(environment.apiUrl+'/Deposit/'+id);
  }
 
  addDeposit(deposit?: DepositModel): Promise<any>{   
    return axios.post(environment.apiUrl+'/Deposit', deposit);
  }
 
  deleteDeposit(id:number): Promise<any>{
    return axios.delete(environment.apiUrl+'/Deposit/' + id);
  }
 
  updateDeposit(id: number, deposit: DepositModel): Promise<any>{    
    return axios.put(environment.apiUrl+'/Deposit/' + id, deposit);
  }

 
}