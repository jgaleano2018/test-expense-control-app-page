import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../adapters/services/navigation/navigation.service';
import { NavigationItem } from '../../domain/models/navigation/navigation-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  navigationItems: NavigationItem[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.getNavigationItems().subscribe(data => {
      this.navigationItems = data;
    });
  }
}