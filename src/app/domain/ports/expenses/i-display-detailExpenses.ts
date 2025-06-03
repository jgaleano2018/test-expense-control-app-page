import { Observable } from "rxjs"
import { DetailExpensesModel } from "../../models/expenses/detailExpenses.model"

export default interface IDisplayDetailExpenses {

    heroes: DetailExpensesModel[]
    filter: string
    
    askDepositsList(): Observable<void>
    askDepositsFiltered(filter: string, allowEmpty?: boolean): Observable<void>
    askDepositCreation(account: string): Observable<void>
    askDepositCreation(description: string): Observable<void>
    askDepositCreation(amount: number): Observable<void>
    askDepositDeletion(hero: DetailExpensesModel): Observable<void>
}