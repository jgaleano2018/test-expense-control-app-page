export class ExpensesOperationError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'ExpensesOperationError';
    }
}