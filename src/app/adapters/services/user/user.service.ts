import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, Observable } from 'rxjs';

import { UserModel } from '../../../domain/models/user/user.model';
import { UserOperationError } from '../../../domain/errors/user/user-operation-error';
import { environment } from '../../../environtments/environtment';


@Injectable({ providedIn: 'root' })
export class UserService  {

  private userUrl = 'api/user';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(environment.apiUrl).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getUser(id: number): Observable<UserModel> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.get<UserModel>(url).pipe(
      catchError(this.handleHttpError())
    );
  }

  /* GET heroes whose name contains search term */
  searchUsers(term: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/?name=${term}`).pipe(
      catchError(this.handleHttpError())
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(environment.apiUrl, user, this.httpOptions).pipe(
      catchError(this.handleHttpError())
    );
  }

  /** DELETE: delete the hero from the server */
  deleteUser(id: number): Observable<number> {
    const url = `${environment.apiUrl}/${id}`;
    return this.http.delete<UserModel>(url, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the deleted hero id
      map(_ => id)
    );
  }

  /** PUT: update the hero on the server */
  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(environment.apiUrl, user, this.httpOptions).pipe(
      catchError(this.handleHttpError()),
      // returns the modified hero
      map(_ => user)
    );
  }

  /**
   * Handle Http operation that failed.
   * Throw an HeroOperation
   */
   private handleHttpError() {
    return (error: any): Observable<any> => {
      throw new UserOperationError(error.body.error);
    };
  }

}