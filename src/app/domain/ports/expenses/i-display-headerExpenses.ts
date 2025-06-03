import { Observable } from "rxjs"
import { HeaderExpensesModel } from "../../models/expenses/headerExpenses.model"

export default interface IDisplayDetailExpenses {

    heroes: HeaderExpensesModel[]
    filter: string
    
    askDepositsList(): Observable<void>
    askDepositsFiltered(filter: string, allowEmpty?: boolean): Observable<void>
    askDepositCreation(account: string): Observable<void>
    askDepositCreation(description: string): Observable<void>
    askDepositCreation(amount: number): Observable<void>
    askDepositDeletion(hero: HeaderExpensesModel): Observable<void>
}