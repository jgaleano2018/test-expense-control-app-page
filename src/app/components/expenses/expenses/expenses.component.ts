import { afterNextRender, Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxSelectBoxModule, DxToolbarModule,  
  DxDataGridComponent} from 'devextreme-angular';
import { DepositService } from '../../../adapters/services/deposit/deposit.service';
import { Router } from "@angular/router";
import { DepositModel } from '../../../domain/models/deposit/deposit.model';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService } from '../../../adapters/services/expenses/expenses.service';
import { MonetaryFundTypeModel } from '../../../domain/models/monetaryFundType/monetaryFundType.model';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BusinessModel } from '../../../domain/models/business/business.model';
import { HeaderExpensesModel } from '../../../domain/models/expenses/headerExpenses.model';
import { DocumentTypeModel } from '../../../domain/models/documentType/documentType.model';
import { DetailExpensesModel } from '../../../domain/models/expenses/detailExpenses.model';
import { ExpenseTypeModel } from '../../../domain/models/expenseType/expenseType.model';
import { ExpenseTypeService } from '../../../adapters/services/expenseType/expenseType.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-budget',
  imports: [DxButtonModule, 
        DxTextBoxModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule,
        DxNumberBoxModule,
        DxSelectBoxModule, DxToolbarModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, DatePipe ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  loading = false;
  formDataHeader!: FormGroup<any>;
  formDataDetail!: FormGroup<any>;
  headerExpenses: HeaderExpensesModel[] = [];
  detailExpenses: DetailExpensesModel[] = [];
  detailExpensesToSave: DetailExpensesModel[] = [];
  monetaryFundTypeList: MonetaryFundTypeModel[] = [];
  monetaryFundTypeSelected: MonetaryFundTypeModel | undefined;
  businessList: BusinessModel[] = [];
  businessSelected: BusinessModel | undefined;
  documentTypeList: DocumentTypeModel[] = [];
  documentTypeSelected: DocumentTypeModel | undefined;
  expensesTypeList: ExpenseTypeModel[] = [];
  expensesTypeSelected: ExpenseTypeModel | undefined;
  userId: number = 0;
  headerExpenseId: number = 0;
  isEnableHeaderExpense: boolean = true;
  isEnableDetailExpense: boolean = true;
  isCreatingHeaderExpense: boolean = false;
  isCreatingDetailExpense: boolean = false;
  isEditingHeaderExpense: boolean = false;
  isEditingDetailExpense: boolean = false;

  headerExpensesModelVal: HeaderExpensesModel | undefined;
  detailExpensesModelVal: DetailExpensesModel = { idDetailExpenses:0, idHeaderExpenses: 0, idExpenseType: 0, idUser: 0, amount:0, key: 0, type: '' };
  isDropDownBoxOpened = false;
  expensesTypeId: any;
  businessId: any;
  monetaryFundTypeId: any;
  documentTypeId: any;

  @ViewChild("mainGridHeader", { static: false }) mainGridHeader: any = DxDataGridComponent;
  @ViewChild("mainGridDetail", { static: false }) mainGridDetail: any = DxDataGridComponent;
  
  title = 'expenses';
  allValid: any;
  subjects: any = [];
  rowData: any = [];
  rowDataDetail: any = [];
  
  constructor(public expensesService: ExpensesService, public expenseTypeService: ExpenseTypeService, private router: Router) { 
    afterNextRender(() => {
      const userId =localStorage.getItem("userId");
      this.userId = userId ? JSON.parse(userId) as any : 0;
    });
  }

  ngOnInit() {
    this.formDataHeader = new FormGroup({
      business: new FormControl(null, [Validators.required]),
      monetaryFundType: new FormControl(null, [Validators.required]),
      documentType: new FormControl(null, [Validators.required])
    });

    this.formDataDetail = new FormGroup({
      expenseType: new FormControl(null, [Validators.required])
    });

    this.headerExpenses = [];
    this.detailExpenses = [];
    this.monetaryFundTypeList = [];
    this.expensesTypeList = [];
    this.getHeaderExpenses();
    this.getBusiness();
    this.getMonetaryFundType();
    this.getDocumentType();
    this.getExpensesType();
  }   


  /****Section Header Expenses****/

  onEditingStartHeader(e: any) {
      this.rowData["key"] = e.key;
      this.isEditingHeaderExpense = true;
      this.isCreatingDetailExpense = false;
      this.isCreatingHeaderExpense = false;
  }
  onEditorPreparingHeader(e: any) {
    if (e.dataField === "idHeaderExpenses" && e.parentType === "dataRow") {
      this.rowData["idHeaderExpenses"] = e.row.data.idHeaderExpenses;
      this.allValid = !e.row.data.idHeaderExpenses || e.row.data.idHeaderExpenses === "" && e.row.data.hasOwnProperty("idHeaderExpenses");
      try {
        if (e.row.data.idHeaderExpenses != undefined) {
          if (this.isEditingHeaderExpense) {
            this.getDetailExpenses(e.row.data.idHeaderExpenses);
          }
        }
      }
      catch(e) {        
      }
    }
  }

  onInitNewRow(e: any) {
    if (!this.isCreatingHeaderExpense && !this.isCreatingDetailExpense) {
      this.detailExpenses = [];
      this.isCreatingHeaderExpense = true;
      this.isEditingHeaderExpense = false;
      this.isEditingDetailExpense = false;
      this.detailExpensesToSave = [];
    }
  }

  setCellValue(newData: any, value: any) {   
    let column = (<any>this);
    column.defaultSetCellValue(newData, value);    
  }

  saveButtonHeader = () => {  
    this.mainGridHeader.instance.saveEditData();
    this.mainGridHeader.instance.refresh();
  }

  cancelButtonHeader = () => {
    this.mainGridHeader.instance.cancelEditData();
  }

  onRowValidatingHeader(e: any) {
    let monetaryFundTypeId = this.formDataHeader.get('monetaryFundType')!.value
    let businnesId = this.formDataHeader.get('business')!.value;
    let documentTypeId = this.formDataHeader.get('documentType')!.value;
    let monetaryFundTypeIdCopy = 0;
    let businnesIdCopy = 0;
    let documentTypeIdCopy = 0;

    try {
      businnesIdCopy = businnesId.idBusiness != null ? businnesId.idBusiness : 0;
      monetaryFundTypeIdCopy = monetaryFundTypeId.idMonetaryFundType != null ? monetaryFundTypeId.idMonetaryFundType : 0;
      documentTypeIdCopy = documentTypeId.idDocumentType != null ? documentTypeId.idDocumentType : 0;
    } 
    catch(e) {      
    }

    const headerExpensesValLoc: HeaderExpensesModel = {
      'idHeaderExpenses': 0,
      'idUser': this.userId,
      'account': e.newData.account,
      'dateExpense': e.newData.dateExpense,
      'observations': e.newData.observations,
      'idBusiness': businnesIdCopy,
      'idMonetaryFundType': monetaryFundTypeIdCopy,
      'idDocumentType': documentTypeIdCopy,
      key: 0,
      type: ""
    }
    this.headerExpensesModelVal = headerExpensesValLoc;
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemovedHeader(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })
  }

  onSavingHeader(e: any) {

    let continueProccess = false;

    try {

      if (this.rowData["key"].idHeaderExpenses != null && this.rowData["key"].idHeaderExpenses != undefined) {
        let headerExpensesModelValLoc: HeaderExpensesModel;
        if (e.changes[0]) {
          headerExpensesModelValLoc = { 
            "idHeaderExpenses": e.changes[0].data.idHeaderExpenses != undefined ? e.changes[0].data.idHeaderExpenses : this.rowData["key"].idHeaderExpenses,
            "idUser": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowData["key"].idUser,
            "account": e.changes[0].data.account != undefined ? e.changes[0].data.account : this.rowData["key"].account,
            "dateExpense": e.changes[0].data.dateExpense != undefined ? e.changes[0].data.dateExpense : this.rowData["key"].dateExpense,
            "observations": e.changes[0].data.observations != undefined ? e.changes[0].data.observations : this.rowData["key"].observations,
            "idBusiness": e.changes[0].data.idBusiness != undefined ? e.changes[0].data.idBusiness : this.rowData["key"].idBusiness,
            "idMonetaryFundType": e.changes[0].data.idMonetaryFundType != undefined ? e.changes[0].data.idMonetaryFundType : this.rowData["key"].idMonetaryFundType,
            "idDocumentType": e.changes[0].data.idDocumentType != undefined ? e.changes[0].data.idDocumentType : this.rowData["key"].idDocumentType,
            "key": e.changes[0].data.key != undefined ? e.changes[0].data.key : this.rowData["key"].key,
            "type": "update"
          };
          e.changes[0] = {       
            idHeaderExpenses: this.rowData["key"].idHeaderExpenses,
            idUser: this.rowData["key"].idUser,
            account: this.rowData["key"].account,
            dateExpense: this.rowData["key"].dateExpense,
            observations: this.rowData["key"].observations,
            idBusiness: this.rowData["key"].idBusiness,
            idMonetaryFundType: this.rowData["key"].idMonetaryFundType,
            idDocumentType: this.rowData["key"].idDocumentType,
            key: this.rowData["key"].key,
            type: "update"
          }
        } else {
          headerExpensesModelValLoc = { 
            "idHeaderExpenses": this.rowData["key"].idHeaderExpenses,
            "idUser": this.rowData["key"].idUser,
            "account": this.rowData["key"].account,
            "dateExpense": this.rowData["key"].dateExpense,
            "observations": this.rowData["key"].observations,
            "idBusiness": this.rowData["key"].idBusiness,            
            "idMonetaryFundType": this.rowData["key"].idMonetaryFundType,
            "idDocumentType": this.rowData["key"].idDocumentType,            
            "key": this.rowData["key"].key,
            "type": "update"
          };
          e.changes.push({
            idHeaderExpenses: this.rowData["key"].idHeaderExpenses,
            idUser: this.rowData["key"].idUser,
            account: this.rowData["key"].account,
            dateExpense: this.rowData["key"].dateExpense,
            observations: this.rowData["key"].observations,
            idBusiness: this.rowData["key"].idBusiness,
            idMonetaryFundType: this.rowData["key"].idMonetaryFundType,
            idDocumentType: this.rowData["key"].idDocumentType,
            key: this.rowData["key"].key,
            type: "update"
          })
        }

        this.headerExpensesModelVal = headerExpensesModelValLoc;

        //Check, fault filling the variablke>> detailExpensesToSave

        if (this.headerExpensesModelVal) {
          this.expensesService.updateExpenses(this.headerExpensesModelVal.idHeaderExpenses, this.headerExpensesModelVal, this.detailExpensesToSave)
          .then(({data}) => {
            Swal.fire({
              icon: 'success',
              title: 'Expenses updated successfully!',
              showConfirmButton: false,
              timer: 1500
            })
          }).catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'An Error Occured!',
              showConfirmButton: false,
              timer: 1500
            })
            return error
          });
        }
      }
      else {
        continueProccess = true;        
      }
    }
    catch(e) {
      continueProccess = true;
    }

    if (continueProccess) {
        try {
          if (this.monetaryFundTypeId.idMonetaryFundType != undefined) {}
          if (this.businessId.idBusiness != undefined) {}
          if (this.documentTypeId.idDocumentType != undefined) {}
        }
        catch(e) {
          Swal.fire({
            icon: 'error',
            title: 'Error. You should to select a Monetary Fund Type, Business or DocumentType.',
            showConfirmButton: false,
            timer: 1500
          });
        }

        if (this.monetaryFundTypeId.idMonetaryFundType>0 && this.businessId.idBusiness>0 && this.documentTypeId.idDocumentType>0) {
          if (this.detailExpenses.length>0) {
            this.expensesService.addExpenses(this.headerExpensesModelVal, this.detailExpenses)
            .then(({data}) => {   
              this.isCreatingHeaderExpense = false;
              this.isCreatingDetailExpense = false;
              this.isEditingHeaderExpense = false;
              this.isEditingDetailExpense = false;

              Swal.fire({
                icon: 'success',
                title: 'Expenses created successfully!',
                showConfirmButton: false,
                timer: 1500
              })
            }).catch(error => {
              this.isCreatingHeaderExpense = false;
              this.isCreatingDetailExpense = false;
              this.isEditingHeaderExpense = false;
              this.isEditingDetailExpense = false;

              Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
              })
              return error
            });
          }
          else {

            Swal.fire({
              icon: 'error',
              title: 'Error. Before saving the expense header, the expense details must be entered.',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Error. You must enter all required fields.',
            showConfirmButton: false,
            timer: 1500
          });
        }
    }
  }

  getHeaderExpenses() {
    this.expensesService.getHeaderExpensess()
    .then(({data}) => {   
      let headerExpensesTempSingle: HeaderExpensesModel;      
      for (let i=0; i<data.length; i++) {
        console.log(data[i]);
        headerExpensesTempSingle = data[i];
        headerExpensesTempSingle.key = data[i].idHeaderExpenses;
        headerExpensesTempSingle.type = "array";
        this.headerExpenses.push(headerExpensesTempSingle);
      }

    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  getMonetaryFundType() {
    this.expensesService.getMonetaryFundType()
    .then(({data}) => { 
      this.monetaryFundTypeList = data;
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  getBusiness() {
    this.expensesService.getBusinessType()
    .then(({data}) => {   
      this.businessList = data;
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  getDocumentType() {
    this.expensesService.getDocumentType()
    .then(({data}) => {  
      this.documentTypeList = data;
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  onSubmitHeader() {
    this.monetaryFundTypeId = this.formDataHeader.get('monetaryFundType')!.value;
    this.businessId = this.formDataHeader.get('business')!.value;
    this.documentTypeId = this.formDataHeader.get('documentType')!.value;
  }

  onSubmitDetail() {
    this.expensesTypeId = this.formDataDetail.get('expenseType')!.value;
  }

  onSelectionChangedHeader(e: any) {
    console.log(e);
  }




  /**Section Detail Expenses**/

  onEditingStartDetail(e: any) {
      this.rowDataDetail["key"] = e.key;
  }

  onEditorPreparingDetail(e: any) {
    if (e.dataField === "idDetailExpenses" && e.parentType === "dataRow") {
      this.rowDataDetail["idDetailExpenses"] = e.row.data.idDetailExpenses;
      this.allValid = !e.row.data.idDetailExpenses || e.row.data.idDetailExpenses === "" && e.row.data.hasOwnProperty("idDetailExpenses");
    }
  }

  onInitNewRowDetail(e: any) {
    this.isCreatingDetailExpense = false;
  }

  setCellValueDetail(newData: any, value: any) {   
    let column = (<any>this);
    column.defaultSetCellValue(newData, value);    
  }


  saveButtonDetail = () => {  
    this.mainGridDetail.instance.saveEditData();
    this.mainGridDetail.instance.refresh();
  }

  cancelButtonDetail = () => {
    this.mainGridDetail.instance.cancelEditData();
  }

  onRowValidatingDetail(e: any) {   
    let expensesTypeId = this.formDataDetail.get('expenseType')!.value
    let expensesTypeIdCopy = 0;

    try {
      expensesTypeIdCopy = expensesTypeId.idExpenseType != null ? expensesTypeId.idExpenseType : 0;
    } 
    catch(e) {      
    }
   
    const detailExpensesValLoc: DetailExpensesModel = {
      'idDetailExpenses': 0,
      'idHeaderExpenses': this.headerExpenseId,
      'idExpenseType': expensesTypeIdCopy,
      'amount':  e.newData.amount,
      'idUser': this.userId,
      key: 0,
      type: ""
    }

    this.detailExpensesModelVal = detailExpensesValLoc
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemovedDetail(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })
  }

  onSavingDetail(e: any) {

    let continueProccess = false;
    try {
      if (this.rowDataDetail["key"].idHeaderExpenses != null && this.rowDataDetail["key"].idHeaderExpenses != undefined && this.rowDataDetail["key"].idDetailExpenses != null && this.rowDataDetail["key"].idDetailExpenses != undefined) {
        let detailExpensesModelValLoc: DetailExpensesModel;
        if (e.changes[0]) {
          detailExpensesModelValLoc = { 
            "idDetailExpenses": e.changes[0].data.idDetailExpenses != undefined ? e.changes[0].data.idDetailExpenses : this.rowDataDetail["key"].idDetailExpenses,            
            "idHeaderExpenses": e.changes[0].data.idHeaderExpenses != undefined ? e.changes[0].data.idHeaderExpenses : this.rowDataDetail["key"].idHeaderExpenses,
            "idExpenseType": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowDataDetail["key"].idUser,
            "amount": e.changes[0].data.account != undefined ? e.changes[0].data.account : this.rowDataDetail["key"].account,
            "idUser": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowDataDetail["key"].idUser,
            "key": e.changes[0].data.key != undefined ? e.changes[0].data.key : this.rowDataDetail["key"].key,
            "type": "update"
          };
          e.changes[0] = {       
            idDetailExpenses: this.rowDataDetail["key"].idDetailExpenses,            
            idHeaderExpenses: this.rowDataDetail["key"].idHeaderExpenses,
            idExpenseType: this.rowDataDetail["key"].idExpenseType,
            amount: this.rowDataDetail["key"].amount,
            idUser: this.rowDataDetail["key"].idUser,
            key: this.rowDataDetail["key"].key,
            type: "update"
          }
        } else {
          detailExpensesModelValLoc = { 
            idDetailExpenses: this.rowDataDetail["key"].idDetailExpenses,            
            idHeaderExpenses: this.rowDataDetail["key"].idHeaderExpenses,
            idExpenseType: this.rowDataDetail["key"].idExpenseType,
            amount: this.rowDataDetail["key"].amount,
            idUser: this.rowDataDetail["key"].idUser,
            key: this.rowDataDetail["key"].key,
            type: "update"
          };
          e.changes.push({
            idDetailExpenses: this.rowDataDetail["key"].idDetailExpenses,            
            idHeaderExpenses: this.rowDataDetail["key"].idHeaderExpenses,
            idExpenseType: this.rowDataDetail["key"].idExpenseType,
            amount: this.rowDataDetail["key"].amount,
            idUser: this.rowDataDetail["key"].idUser,
            key: this.rowDataDetail["key"].key,
            type: "update"
          })
        }
        this.detailExpensesModelVal = detailExpensesModelValLoc;
      }
      else {
        continueProccess = true;        
      }
    }
    catch(e) {
      continueProccess = true;
    }

    if (continueProccess) {
        try {
          if (this.expensesTypeId.idExpensesType != undefined) {}
        }
        catch(e) {
          Swal.fire({
            icon: 'error',
            title: 'Error. You should to select a Expense Type.',
            showConfirmButton: false,
            timer: 1500
          });
        }

        if (this.expensesTypeId.idExpenseType>0) {
          this.detailExpensesModelVal = { 
            idDetailExpenses: 0,            
            idHeaderExpenses: 0,
            idExpenseType: this.expensesTypeId.idExpenseType,
            amount: this.detailExpensesModelVal.amount,
            idUser: this.userId,
            key: this.detailExpensesModelVal.key,
            type: this.detailExpensesModelVal.type
          };

          try {
            if (this.detailExpensesModelVal.idDetailExpenses==0) {
              this.detailExpenses.push(this.detailExpensesModelVal);
            }
          }
          catch(e) {}

          let newArrayDetailExpenses: DetailExpensesModel[] = [];
          for (let idx=0; idx<this.detailExpenses.length; idx++) {
              try {
                if (this.detailExpenses[idx].idHeaderExpenses>=0 && this.detailExpenses[idx].idDetailExpenses>=0 && this.detailExpenses[idx].idExpenseType>=0 && this.detailExpenses[idx].idUser>=0 && this.detailExpenses[idx].amount>=0) {
                  newArrayDetailExpenses.push(this.detailExpenses[idx]);
                }
              }
              catch(e) {
              }
          }
          this.detailExpenses = [];
          this.detailExpenses = newArrayDetailExpenses;
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Error. You must enter all required fields.',
            showConfirmButton: false,
            timer: 1500
          });
        }
    }
  }

  getDetailExpenses(idHeaderExpenses: number) {
    this.expensesService.getDetailExpensesSingle(idHeaderExpenses)
    .then(({data}) => { 
      this.detailExpenses = [];
      let detailExpensesTempSingle: DetailExpensesModel;      
      for (let i=0; i<data.length; i++) {
        console.log(data[i]);
        detailExpensesTempSingle = data[i];
        detailExpensesTempSingle.key = data[i].idDetailExpenses;
        detailExpensesTempSingle.type = "array";
        this.detailExpenses.push(detailExpensesTempSingle);
      }

      //this.mainGridDetail.instance.refresh();

    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }

  getExpensesType() {
    this.expenseTypeService.getExpensesType()
    .then(({data}) => {   
      this.expensesTypeList = data;

    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      })
      return error
    });
  }


}
