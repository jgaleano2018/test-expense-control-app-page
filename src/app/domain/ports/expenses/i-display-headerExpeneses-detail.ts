import { Observable } from "rxjs"
import { HeaderExpensesModel } from "../../models/expenses/headerExpenses.model"

export default interface IDisplayHeaderExpensesDetail {

    hero: HeaderExpensesModel | undefined

    askDetailExpensesDetail(iddeposit: number): Observable<void>
    askDetailExpensesAccountChange(account: string): Observable<void>
    askDetailExpensesDescriptionChange(description: string): Observable<void>
    askDetailExpensesAmountChange(amount: number): Observable<void>
}