import { Observable } from "rxjs"
import { DepositModel } from "../../models/deposit/deposit.model"

export default interface IManageDeposits {

    getDeposits(): Observable<DepositModel[]>
    searchDeposits(term: string): Observable<DepositModel[]>
    getDeposit(idDeposit: number): Observable<DepositModel> 
    addDeposit(deposit: DepositModel): Observable<DepositModel>
    updateDeposit(deposit: DepositModel): Observable<DepositModel>
    deleteDeposit(idDeposit: number): Observable<number>

}