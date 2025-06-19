export class ReportMovementBudgetsExpensesModel {
    idBudget!: number;
    dateBudget!: Date;
    accountBudget!: string;
    descriptionBudget!: string;
    amountBudget!: number;
    idHeaderExpenses!: number;
    dateExpense!: Date;
    idMonetaryFundType!: number;
    monetaryFundTypeName!: string;
    observations!: string;
    idBusiness!: number;
    businessName!: string;
    idDocumentType!: number;
    documentTypeName!: string;
    idDetailExpenses!: number;
    idExpenseType!: number;
    expenseTypeName!: string;
    amountDetailExpense!: number;
    idUser!: number;
    userName!: string;
}