import { Observable } from "rxjs"
import { DetailExpensesModel } from "../../models/expenses/detailExpenses.model"

export default interface IManageDetailExpenses {

    getDetailExpensess(): Observable<DetailExpensesModel[]>
    searchDetailExpensess(term: string): Observable<DetailExpensesModel[]>
    getDetailExpenses(id: number): Observable<DetailExpensesModel> 
    addDetailExpenses(hero: DetailExpensesModel): Observable<DetailExpensesModel>
    updateDetailExpenses(hero: DetailExpensesModel): Observable<DetailExpensesModel>
    deleteDetailExpenses(id: number): Observable<number>

}