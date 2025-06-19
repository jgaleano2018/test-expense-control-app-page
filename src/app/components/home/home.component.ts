import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../adapters/services/navigation/navigation.service';
import { NavigationItem } from '../../domain/models/navigation/navigation-item.model';
import {RouterModule} from '@angular/router';
import { JsonPipe } from '@angular/common';
import { environment } from '../../environtments/environtment';

@Component({
  selector: 'app-root',
  imports: [RouterModule, JsonPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  navigationItems: NavigationItem[] = [];
  apiUrl = environment.apiUrl

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.getNavigationItems().subscribe(data => {
      this.navigationItems = data;
    });
  }
}