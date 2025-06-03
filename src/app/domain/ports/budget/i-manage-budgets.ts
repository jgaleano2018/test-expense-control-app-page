import { Observable } from "rxjs"
import { BudgetModel } from "../../models/budget/budget.model"

export default interface IManageHeroes {

    getBudgets(): Observable<BudgetModel[]>
    searchBudgets(term: string): Observable<BudgetModel[]>
    getBudget(id: number): Observable<BudgetModel> 
    addBudget(budget: BudgetModel): Observable<BudgetModel>
    updateBudget(budget: BudgetModel): Observable<BudgetModel>
    deleteBudget(id: number): Observable<number>

}