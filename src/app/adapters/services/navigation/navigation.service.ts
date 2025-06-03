import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavigationItem } from '../../../domain/models/navigation/navigation-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private http: HttpClient) {}

  public getNavigationItems(): Observable<NavigationItem[]> {
    return this.http.get<NavigationItem[]>('./assets/navigation.json');
  }
}