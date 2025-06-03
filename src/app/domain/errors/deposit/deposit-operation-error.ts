export class DepositOperationError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'DepositOperationError';
    }
}