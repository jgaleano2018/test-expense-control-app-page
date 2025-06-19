export interface DepositModel {
  idDeposit: number;
  account: string;
  date: Date;
  amount: number;
  idMonetaryFundType: number;
  idUser: number;
  key: number;
  type: string;
}