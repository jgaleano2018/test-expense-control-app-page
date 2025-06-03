import { Observable } from "rxjs"
import { BudgetModel } from "../../models/budget/budget.model"

export default interface IDisplayBudgets {

    heroes: BudgetModel[]
    filter: string
    
    askBudgetsList(): Observable<void>
    askBudgetsFiltered(filter: string, allowEmpty?: boolean): Observable<void>
    askBudgetCreation(account: string): Observable<void>
    askBudgetCreation(description: string): Observable<void>
    askBudgetCreation(amount: number): Observable<void>
    askBudgetDeletion(hero: BudgetModel): Observable<void>
}