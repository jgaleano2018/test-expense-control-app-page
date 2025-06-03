
import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { BudgetComponent } from '../app/components/budget/budget/budget.component';
import { DepositComponent } from '../app/components/deposit/deposit/deposit.component';
import { ExpensesComponent } from '../app/components/expenses/expenses/expenses.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'budget', component: BudgetComponent },
    { path: 'deposit', component: DepositComponent },
    { path: 'expenses', component: ExpensesComponent }

];
