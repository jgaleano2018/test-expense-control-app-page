import { Observable } from "rxjs"
import { DepositModel } from "../../models/deposit/deposit.model"

export default interface IDisplayDeposits {

    heroes: DepositModel[]
    filter: string
    
    askDepositsList(): Observable<void>
    askDepositsFiltered(filter: string, allowEmpty?: boolean): Observable<void>
    askDepositCreation(account: string): Observable<void>
    askDepositCreation(description: string): Observable<void>
    askDepositCreation(amount: number): Observable<void>
    askDepositDeletion(hero: DepositModel): Observable<void>
}