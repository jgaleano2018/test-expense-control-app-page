import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule } from 'devextreme-angular';
import { UserService } from '../../adapters/services/user/user.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserModel } from '../../domain/models/user/user.model';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [DxButtonModule, 
        DxTextBoxModule,
        DxDataGridModule,
        DxFormModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule,
      DxNumberBoxModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loading = false;
  formData!: FormGroup<any>;
  users: UserModel[] = [];

  constructor(public userService: UserService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.formData = new FormGroup({
      userName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])      
    });

    this.users = [];
  }   


  loginUser() {

    let IdUserValue: any;
    if (this.formData.get('userName')!.value != null && this.formData.get('userName')!.value != "" && this.formData.get('password')!.value != null && this.formData.get('password')!.value != "") {

      const dataUser = {
        'userName': this.formData.get('userName')!.value,
        'password': this.formData.get('password')!.value        
      }

      this.userService.getUsers()
      .then(({data}) => {      
        console.log(data);

        for (let idx:number =0; idx<data.length; idx++) {
          if (data[idx].userName.toLowerCase() === dataUser.userName.toLowerCase() && data[idx].password.toLowerCase() === dataUser.password.toLowerCase()) {
            IdUserValue =  data[idx].idUser;
          }
        }

        if (IdUserValue>0) {
          localStorage.setItem("userId", IdUserValue.toString());
          this.router.navigate(['home']);
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'User not registered!',
            showConfirmButton: false,
            timer: 1500
          });
          localStorage.setItem("userId", "0");
          this.router.navigate(['user']);
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
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error. You must enter your username and password.!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

}
