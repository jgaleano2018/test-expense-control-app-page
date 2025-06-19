import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NavigationItem } from '../../../domain/models/navigation/navigation-item.model';
import { environment } from '../../../environtments/environtment';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  public getNavigationItems(): Observable<NavigationItem[]> {

    let arrayNavigationItem: NavigationItem[] =  [
      { "id": 1, "name": "Budget", "url": "budget" },
      { "id": 2, "name": "Deposit", "url": "deposit" },
      { "id": 3, "name": "Expenses", "url": "expenses" },
      { "id": 4, "name": "User", "url": "user" },
      { "id": 5, "name": "Reports", "url": "reports" },
      { "id": 6, "name": "Charts", "url": "charts" }    
    ];

    return of(arrayNavigationItem);

  }

}