import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';

import { DetailExpensesModel } from '../../../domain/models/expenses/detailExpenses.model';
import { HeaderExpensesModel } from '../../../domain/models/expenses/headerExpenses.model';

import { ExpensesOperationError } from '../../../domain/errors/expenses/expenses-operation-error';

import IManageDetailExpenses from '../../../domain/ports/expenses/i-manage-detailExpenses';
import { environment } from '../../../environtments/environtment';
import IManageHeaderExpenses from '../../../domain/ports/expenses/i-manage-headerExpenses';
import { MonetaryFundTypeModel } from '../../../domain/models/monetaryFundType/monetaryFundType.model';
import { BusinessModel } from '../../../domain/models/business/business.model';
import { ExpensesTypeModel } from '../../../domain/models/expenses/expensesType.model';


@Injectable({ providedIn: 'root' })
export class ExpensesService implements IManageHeaderExpenses, IManageDetailExpenses {

  private expensesUrl = 'api/expenses';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getDetailExpensess(): Observable<DetailExpensesModel[]> {
    return this.http.get<DetailExpensesModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET heroes from the server */
  getHeaderExpensess(): Observable<HeaderExpensesModel[]> {
    return this.http.get<HeaderExpensesModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

   /** GET heroes from the server */
  getMonetaryFundType(): Observable<MonetaryFundTypeModel[]> {
    return this.http.get<MonetaryFundTypeModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

   /** GET heroes from the server */
  getBusinessType(): Observable<BusinessModel[]> {
    return this.http.get<BusinessModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET heroes from the server */
  getExpensesType(): Observable<ExpensesTypeModel[]> {
    return this.http.get<ExpensesTypeModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }


  /** GET hero by id. Will 404 if id not found */
  getDetailExpenses(id: number): Observable<DetailExpensesModel> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<DetailExpensesModel>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

   /** GET hero by id. Will 404 if id not found */
  getHeaderExpenses(id: number): Observable<HeaderExpensesModel> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<HeaderExpensesModel>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

  /* GET heroes whose name contains search term */
  searchHeaderExpensess(term: string): Observable<HeaderExpensesModel[]> {
    return this.http.get<HeaderExpensesModel[]>(`${environment.apiUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

   /* GET heroes whose name contains search term */
  searchDetailExpensess(term: string): Observable<DetailExpensesModel[]> {
    return this.http.get<DetailExpensesModel[]>(`${environment.apiUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHeaderExpenses(dataHeaderExpenses: HeaderExpensesModel): Observable<HeaderExpensesModel> {
    return this.http.post<HeaderExpensesModel>(environment.apiUrl, dataHeaderExpenses, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** POST: add a new hero to the server */
  addDetailExpenses(expenses: DetailExpensesModel): Observable<DetailExpensesModel> {
    return this.http.post<DetailExpensesModel>(environment.apiUrl, expenses, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHeaderExpenses(id: number): Observable<number> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.delete<HeaderExpensesModel>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

   /** DELETE: delete the hero from the server */
  deleteDetailExpenses(id: number): Observable<number> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.delete<DetailExpensesModel>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

  /** PUT: update the hero on the server */
  updateHeaderExpenses(expenses: HeaderExpensesModel): Observable<HeaderExpensesModel> {
    return this.http.put<HeaderExpensesModel>(environment.apiUrl, expenses, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => expenses)
    );
  }

   /** PUT: update the hero on the server */
  updateDetailExpenses(expenses: DetailExpensesModel): Observable<DetailExpensesModel> {
    return this.http.put<DetailExpensesModel>(environment.apiUrl, expenses, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => expenses)
    );
  }


  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new ExpensesOperationError(error.body.error);
    };
  }

}