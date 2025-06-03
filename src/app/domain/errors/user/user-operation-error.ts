export class UserOperationError extends Error {
    constructor(message: string){
        super(message);
        this.name = 'UserOperationError';
    }
}