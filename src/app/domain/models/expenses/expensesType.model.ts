export interface ExpensesTypeModel {
  idExpenseType: number;
  idTaxRange: number;
  taxPercentage: number;
  name: string;
  financianCoefficient: number;
  deductible: number;
}