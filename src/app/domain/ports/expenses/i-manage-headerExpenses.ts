import { Observable } from "rxjs"
import { HeaderExpensesModel } from "../../models/expenses/headerExpenses.model"

export default interface IManageHeaderExpenses {

    getHeaderExpensess(): Observable<HeaderExpensesModel[]>
    searchHeaderExpensess(term: string): Observable<HeaderExpensesModel[]>
    getHeaderExpenses(id: number): Observable<HeaderExpensesModel> 
    addHeaderExpenses(hero: HeaderExpensesModel): Observable<HeaderExpensesModel>
    updateHeaderExpenses(hero: HeaderExpensesModel): Observable<HeaderExpensesModel>
    deleteHeaderExpenses(id: number): Observable<number>

}