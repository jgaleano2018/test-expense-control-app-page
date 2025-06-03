import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule } from 'devextreme-angular';
import { UserService } from '../../../adapters/services/user/user.service';
import { Router } from "@angular/router";
import { UserModel } from '../../../domain/models/user/user.model';
import Swal from 'sweetalert2'
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import validationEngine from "devextreme/ui/validation_engine";


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
      DxNumberBoxModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  users: UserModel[] = [];

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {

    this.formData = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
      pasword: new FormControl(null, [Validators.required]),
      
    });

    this.users = [];

    this.getUsers();

  }   

  helloWorld() {
  throw new Error('Method not implemented.');
  }

  saveUser() {

    let validationResult = validationEngine.validateGroup("formGroup");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {

      let userItem: UserModel;
      
      const dataUser: UserModel = {
        'idUser': 0,
        'name': this.formData.get('name')!.value,
        'phone': this.formData.get('phone')!.value,
        'address': this.formData.get('address')!.value,
        'userName': this.formData.get('address')!.value,
        'password': this.formData.get('address')!.value        
      }

      this.userService.addUser(dataUser).pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
            title: 'An Error Occured!',
            showConfirmButton: false,
            timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          Swal.fire({
            icon: 'success',
            title: 'User created successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } 
      });

    }

  }

  allowUpdating(data: UserModel) {

    this.userService.updateUser(data).pipe(
      catchError(() => of(
        Swal.fire({
          icon: 'error',
          title: 'An Error Occured!',
          showConfirmButton: false,
          timer: 1500
        })
      )),
      ).subscribe((res: any) => {if(res) {
        Swal.fire({
          icon: 'success',
          title: 'User updated successfully!',
          showConfirmButton: false,
          timer: 1500
        })
      } 
    });
 

  }

  allowDeleting(data: UserModel) {

     Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result =>{
      if (result.isConfirmed) {

        this.userService.deleteUser(data.idUser).pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
           title: 'An Error Occured!',
           showConfirmButton: false,
           timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          Swal.fire({
            icon: 'success',
            title: 'Budget deleted successfully!',
            showConfirmButton: false,
            timer: 1500
          })
        } });
 
      }
    })

  }

  getUsers() {
    this.userService.getUsers().subscribe((data) => {
      console.log(data);
      this.users = data;
      
    });
  }

}
