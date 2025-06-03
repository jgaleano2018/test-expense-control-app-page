import { Observable } from "rxjs"
import { BudgetModel } from "../../models/budget/budget.model"

export default interface IDisplayBudgetDetail {

    hero: BudgetModel | undefined

    askBudgetDetail(idBudget: number): Observable<void>
    askBudgetAccountChange(account: string): Observable<void>
    askBudgetDescriptionChange(description: string): Observable<void>
    askBudgetAmountChange(amount: number): Observable<void>
}