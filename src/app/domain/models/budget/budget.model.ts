export interface BudgetModel {
  idBudget: number;
  account: string;
  description: string;
  amount: number;
  dateBudget: Date;
  idUser: number;
  idExpenseType: number;
  key: number;
  type: string;
}