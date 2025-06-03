export class BudgetOperationError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'BudgetOperationError';
    }
}