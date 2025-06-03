import { Observable } from "rxjs"
import { DetailExpensesModel } from "../../models/expenses/detailExpenses.model"

export default interface IDisplayHeaderExpensesDetail {

    hero: DetailExpensesModel | undefined

    askHeaderExpensesDetail(iddeposit: number): Observable<void>
    askHeaderExpensesAccountChange(account: string): Observable<void>
    askHeaderExpensesDescriptionChange(description: string): Observable<void>
    askHeaderExpensesAmountChange(amount: number): Observable<void>
}