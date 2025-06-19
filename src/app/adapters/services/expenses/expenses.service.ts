import { Injectable } from '@angular/core';
import { DetailExpensesModel } from '../../../domain/models/expenses/detailExpenses.model';
import { HeaderExpensesModel } from '../../../domain/models/expenses/headerExpenses.model';
import { environment } from '../../../environtments/environtment';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class ExpensesService {

  getHeaderExpensess(): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetAllExpenses');
  }

  getHeaderExpenses(id: number): Promise<any>{
    return axios.get(environment.apiUrl+'/Expenses/GetHeaderExpenses/'+id);
  }

  getDetailExpenses(): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetAllExpenses');
  }

  getDetailExpensesSingle(idDetailExpenses: number): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetAllDetailExpenses/'+idDetailExpenses);
  }

  getMonetaryFundType(): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetMonetaryFundType');
  }

  getBusinessType(): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetBusiness');
  }

  getDocumentType(): Promise<any>{
    return axios.get(environment.apiUrl+'/api/Expenses/GetDocumentType');
  }

  addExpenses(dataHeaderExpenses?: HeaderExpensesModel, dataDetailExpenses?: DetailExpensesModel[]): Promise<any>{   
    
    let expenses = {
      "HeaderExpenses": {
        account: dataHeaderExpenses?.account,
        dateExpense: dataHeaderExpenses?.dateExpense,
        idMonetaryFundType: dataHeaderExpenses?.idMonetaryFundType,
        observations: dataHeaderExpenses?.observations,
        idBusiness: dataHeaderExpenses?.idBusiness,
        idDocumentType: dataHeaderExpenses?.idDocumentType,
        idUser: dataHeaderExpenses?.idUser
      },
      "DetailExpenses": {
      }
    }


     /*"HeaderExpenses": {
        "account": "10000001",
        "dateExpense": "2025-06-12",
        "idMonetaryFundType": 1,
        "idBusiness": 1,
        "Observations": "Expenses contability",
        "idDocumentType": 1,
        "idUser": 1
    },
    "DetailExpenses": [{
        "idExpenseType": 1,
        "amount": 3500000,
        "idUser": 1
    },*****/

    let arrayDetailExpenses = dataDetailExpenses != null ? dataDetailExpenses : [];

    let newDetailExpensesTemplate: any;
    let arrayNewDetExp = [];

    for (let idx=0; idx<arrayDetailExpenses.length; idx++) {

      newDetailExpensesTemplate = {
        "idExpenseType": arrayDetailExpenses[idx].idExpenseType,
        "amount": arrayDetailExpenses[idx].amount,
        "idUser": arrayDetailExpenses[idx].idUser
      }

      arrayNewDetExp.push(newDetailExpensesTemplate);
    }
    

    expenses.DetailExpenses = arrayNewDetExp;

    console.log("After create expenses transaction.....");
    console.log(expenses);

    return axios.post(environment.apiUrl+'/api/Expenses', expenses);
  }


  updateExpenses(id: number, dataHeaderExpenses: HeaderExpensesModel, dataDetailExpenses: DetailExpensesModel[]): Promise<any>{   
    
    let expenses = {
      "HeaderExpenses": {
        idHeaderExpenses: dataHeaderExpenses.idHeaderExpenses,
        account: dataHeaderExpenses.account,
        dateExpense: dataHeaderExpenses.dateExpense,
        idMonetaryFundType: dataHeaderExpenses.idMonetaryFundType,
        observations: dataHeaderExpenses.observations,
        idBusiness: dataHeaderExpenses.idBusiness,
        idDocumentType: dataHeaderExpenses.idDocumentType,
        idUser: dataHeaderExpenses.idUser
      },
      "DetailExpenses": {
      }
    }

    expenses.DetailExpenses = dataDetailExpenses;

    return axios.put(environment.apiUrl+'/Expenses/' + id, expenses);
  }

  deleteExpenses(id:number): Promise<any>{
    return axios.delete(environment.apiUrl+'/Expenses/' + id);
  }

}