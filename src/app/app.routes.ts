import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { BudgetComponent } from '../app/components/budget/budget/budget.component';
import { DepositComponent } from '../app/components/deposit/deposit/deposit.component';
import { ExpensesComponent } from '../app/components/expenses/expenses/expenses.component';
import { UserComponent } from './components/user/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ReportMovementBudgetsExpensesComponent } from './components/reports/report-movement-budgets-expenses.component/report-movement-budgets-expenses.component';
import { ChartBudgetedAndExecutedByExpenseType } from './components/chart/chart-budgeted-and-executed-by-expense-type/chart-budgeted-and-executed-by-expense-type';

export const routes: Routes = [
    { path: '', redirectTo: 'home/login', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'home/budget', component: BudgetComponent },
    { path: 'home/deposit', component: DepositComponent },
    { path: 'home/expenses', component: ExpensesComponent },
    { path: 'home/user', component: UserComponent },
    { path: 'home/login', component: LoginComponent },
    { path: 'home/reports', component: ReportMovementBudgetsExpensesComponent },
    { path: 'home/charts', component: ChartBudgetedAndExecutedByExpenseType }
];
