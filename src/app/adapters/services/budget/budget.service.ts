import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';

import { BudgetModel } from '../../../domain/models/budget/budget.model';
import { BudgetOperationError } from '../../../domain/errors/budget/budget-operation-error';
import IManageBudget from '../../../domain/ports/budget/i-manage-budgets';
import { environment } from '../../../environtments/environtment';


@Injectable({ providedIn: 'root' })
export class BudgetService implements IManageBudget {

  private budgetUrl = 'api/budget';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getBudgets(): Observable<BudgetModel[]> {
    return this.http.get<BudgetModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getBudget(id: number): Observable<BudgetModel> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<BudgetModel>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

  /* GET heroes whose name contains search term */
  searchBudgets(term: string): Observable<BudgetModel[]> {
    return this.http.get<BudgetModel[]>(`${environment.apiUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addBudget(budget: BudgetModel): Observable<BudgetModel> {
    return this.http.post<BudgetModel>(environment.apiUrl, budget, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** DELETE: delete the hero from the server */
  deleteBudget(id: number): Observable<number> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.delete<BudgetModel>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

  /** PUT: update the hero on the server */
  updateBudget(budget: BudgetModel): Observable<BudgetModel> {
    return this.http.put<BudgetModel>(environment.apiUrl, budget, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => budget)
    );
  }

  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new BudgetOperationError(error.body.error);
    };
  }

}