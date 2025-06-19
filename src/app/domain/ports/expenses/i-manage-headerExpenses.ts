import { Observable } from "rxjs"
import { HeaderExpensesModel } from "../../models/expenses/headerExpenses.model"

export default interface IManageHeaderExpenses {

    getHeaderExpensess(): Observable<HeaderExpensesModel[]>
    searchHeaderExpensess(term: string): Observable<HeaderExpensesModel[]>
    getHeaderExpenses(idHeaderExpenses: number): Observable<HeaderExpensesModel> 
    addHeaderExpenses(headerExpenses: HeaderExpensesModel): Observable<HeaderExpensesModel>
    updateHeaderExpenses(headerExpenses: HeaderExpensesModel): Observable<HeaderExpensesModel>
    deleteHeaderExpenses(headerExpenses: number): Observable<number>

}