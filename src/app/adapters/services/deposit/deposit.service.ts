import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';

import { DepositModel } from '../../../domain/models/deposit/deposit.model';
import { DepositOperationError } from '../../../domain/errors/deposit/deposit-operation-error';
import IManageDeposit from '../../../domain/ports/deposit/i-manage-deposits';
import { environment } from '../../../environtments/environtment';


@Injectable({ providedIn: 'root' })
export class DepositService implements IManageDeposit {

  private depositUrl = 'api/deposit';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getDeposits(): Observable<DepositModel[]> {
    return this.http.get<DepositModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getDeposit(id: number): Observable<DepositModel> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<DepositModel>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

  /* GET heroes whose name contains search term */
  searchDeposits(term: string): Observable<DepositModel[]> {
    return this.http.get<DepositModel[]>(`${environment.apiUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addDeposit(deposit: DepositModel): Observable<DepositModel> {
    return this.http.post<DepositModel>(environment.apiUrl, deposit, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** DELETE: delete the hero from the server */
  deleteDeposit(id: number): Observable<number> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.delete<DepositModel>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

  /** PUT: update the hero on the server */
  updateDeposit(deposit: DepositModel): Observable<DepositModel> {
    return this.http.put<DepositModel>(environment.apiUrl, deposit, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => deposit)
    );
  }

  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new DepositOperationError(error.body.error);
    };
  }

}