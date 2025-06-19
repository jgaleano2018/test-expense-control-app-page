import { Observable } from "rxjs"
import { DetailExpensesModel } from "../../models/expenses/detailExpenses.model"

export default interface IManageDetailExpenses {

    searchDetailExpensess(term: string): Observable<DetailExpensesModel[]>
    getDetailExpenses(idHeaderExpenses: number): Observable<DetailExpensesModel[]> 
    getDetailExpensesSingle(idDetailExpenses: number): Observable<DetailExpensesModel>
    addDetailExpenses(detailExpenses: DetailExpensesModel): Observable<DetailExpensesModel>
    updateDetailExpenses(detailExpenses: DetailExpensesModel): Observable<DetailExpensesModel>
    deleteDetailExpenses(idDetailExpenses: number): Observable<number>

}