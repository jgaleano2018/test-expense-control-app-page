import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxToolbarModule, 
  DxDataGridComponent} from 'devextreme-angular';
import { UserService } from '../../../adapters/services/user/user.service';
import { Router } from "@angular/router";
import { UserModel } from '../../../domain/models/user/user.model';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [DxButtonModule, 
        DxTextBoxModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule,
      DxNumberBoxModule, DxToolbarModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  users: UserModel[] = [];
  userModelVal: UserModel | undefined;

  @ViewChild("mainGrid", { static: false }) mainGrid: any = DxDataGridComponent;
  title = 'user';
  allValid: any;
  subjects: any = [];
  rowData: any = [];

  constructor(public userService: UserService, private router: Router) { 
    this.users = [];
    this.getUsers();
  }

  ngOnInit() {
    this.formData = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
      pasword: new FormControl(null, [Validators.required]),
    });
    
  }

  onInitNewRow(e: any) {
    this.subjects = [];
    e.data.Subjects = this.subjects;
  }
  onEditingStart(e: any) {
    this.rowData["key"] = e.key;
    this.subjects = e.data.Subjects.slice();
  }
  onEditorPreparing(e: any) {
    if (e.dataField === "Name" && e.parentType === "dataRow") {
      this.rowData["name"] = e.row.data.Name;
      this.allValid = !e.row.data.Name || e.row.data.Name === "" && e.row.data.hasOwnProperty("Name") || this.subjects.length === 0;
    }
  }

  customizeText(cellInfo: any) {
    if (cellInfo.value) {
      let cellText = "";
      cellInfo.value.forEach((subject: any) => {
        cellText += subject.SubjectName + ',';
      })
      return cellText.slice(0, cellText.length - 1);
    }
    return cellInfo.valueText;
  }

  setCellValue(newData: any, value: any) {
    let column = (<any>this);
    column.defaultSetCellValue(newData, value);
  }

  saveButton = () => {
    this.mainGrid.instance.saveEditData();
    this.mainGrid.instance.refresh();
  }

  cancelButton = () => {
    this.mainGrid.instance.cancelEditData();
  }

  onRowValidating(e: any) {
    const userModelValLoc: UserModel = {
      "idUser": 0,
      "name": e.newData.name,
      "phone": e.newData.phone,
      "address": e.newData.address,
      "userName": e.newData.userName,
      "password": e.newData.password,
      "key": 0,
      "type": 'insert'
    };
    
    this.userModelVal = userModelValLoc;
    this.allValid = e.brokenRules.length > 0 ? true : false;
  }

  onRowRemoved(e: any) {
    setTimeout(() => {
      this.allValid = this.subjects.length === 0 ? true : false;
    })

  }

  onSaving(e: any) {
    if (this.rowData["key"].idUser != null && this.rowData["key"].idUser != undefined) {
      let userModelValLoc: UserModel;
      if (e.changes[0]) {
        userModelValLoc = { 
          "idUser": e.changes[0].data.idUser != undefined ? e.changes[0].data.idUser : this.rowData["key"].idUser,
          "name": e.changes[0].data.name != undefined ? e.changes[0].data.name : this.rowData["key"].name,
          "phone": e.changes[0].data.phone != undefined ? e.changes[0].data.phone : this.rowData["key"].phone,
          "address": e.changes[0].data.address != undefined ? e.changes[0].data.address : this.rowData["key"].address,
          "userName": e.changes[0].data.userName != undefined ? e.changes[0].data.userName : this.rowData["key"].userName,
          "password": e.changes[0].data.password != undefined ? e.changes[0].data.password : this.rowData["key"].password,
          "key": e.changes[0].data.key != undefined ? e.changes[0].data.key : this.rowData["key"].key,
          "type": "update"
        };
        e.changes[0] = {       
          idUser: this.rowData["key"].idUser,
          name: this.rowData["key"].name,
          phone: this.rowData["key"].phone,
          address: this.rowData["key"].address,
          userName: this.rowData["key"].userName,
          password: this.rowData["key"].password,
          key: this.rowData["key"].key,
          type: "update"
        }
      } else {
        userModelValLoc = { 
           "idUser": this.rowData["key"].idUser,
          "name": this.rowData["key"].name,
          "phone": this.rowData["key"].phone,
          "address": this.rowData["key"].address,
          "userName": this.rowData["key"].userName,
          "password": this.rowData["key"].password,
          "key": this.rowData["key"].key,
          "type": "update"
        };
        e.changes.push({
          idUser: this.rowData["key"].idUser,
          name: this.rowData["key"].name,
          phone: this.rowData["key"].phone,
          address: this.rowData["key"].address,
          userName: this.rowData["key"].userName,
          password: this.rowData["key"].password,
          key: this.rowData["key"].key,
          type: "update"
        })
      }

      this.userModelVal = userModelValLoc;
      if (this.userModelVal) {
        this.userService.updateUser(this.userModelVal.idUser, this.userModelVal)
        .then(({data}) => {   
          Swal.fire({
            icon: 'success',
            title: 'User updated successfully!',
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
      if (this.userModelVal) {
        this.userService.addUser(this.userModelVal)
        .then(({data}) => {   
          Swal.fire({
            icon: 'success',
            title: 'User created successfully!',
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
  }

  getUsers() {
    this.userService.getUsers()
    .then(({data}) => {   
      let usersTempSingle: UserModel;      
      for (let i=0; i<data.length; i++) {
        console.log(data[i]);
        usersTempSingle = data[i];
        usersTempSingle.key = data[i].idUser;
        usersTempSingle.type = "array";
        this.users.push(usersTempSingle);
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

}
