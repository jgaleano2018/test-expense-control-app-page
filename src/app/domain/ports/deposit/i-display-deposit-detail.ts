import { Observable } from "rxjs"
import { DepositModel } from "../../models/deposit/deposit.model"

export default interface IDisplayDepositDetail {

    hero: DepositModel | undefined

    askDepositDetail(iddeposit: number): Observable<void>
    askDepositAccountChange(account: string): Observable<void>
    askDepositDescriptionChange(description: string): Observable<void>
    askDepositAmountChange(amount: number): Observable<void>
}