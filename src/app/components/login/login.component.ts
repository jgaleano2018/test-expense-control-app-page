import { Component, OnInit } from '@angular/core';
import { DxDataGridModule, DxFormModule, DxCheckBoxModule, DxValidatorModule,  
  DxValidationSummaryModule, DxValidationGroupModule, 
  DxButtonModule, DxTextBoxModule, DxNumberBoxModule } from 'devextreme-angular';
import { UserService } from '../../adapters/services/user/user.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserModel } from '../../domain/models/user/user.model';
import Swal from 'sweetalert2'
import { catchError, of, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import validationEngine from "devextreme/ui/validation_engine";
import { unzipSync } from 'node:zlib';


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
      DxNumberBoxModule],
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
      pasword: new FormControl(null, [Validators.required])      
    });

    this.users = [];

    this.getUsers();

  }   

  helloWorld() {
  throw new Error('Method not implemented.');
  }

  loginUser() {

    let validationResult = validationEngine.validateGroup("formGroup");

    alert("dxForm is invalid");
      if (!validationResult.isValid) {
    }
    else {

      const dataUser = {
        'userName': this.formData.get('address')!.value,
        'password': this.formData.get('address')!.value        
      }

       this.userService.getUsers().pipe(
        catchError(() => of(
          Swal.fire({
            icon: 'error',
            title: 'An Error Occured!',
            showConfirmButton: false,
            timer: 1500
          })
        )),
        ).subscribe((res: any) => {if(res) {
          
          this.users = res.filter((d: { nom: UserModel[]; }) => d.nom[0].userName.toLowerCase() === dataUser.userName.toLowerCase() && d.nom[0].password.toLowerCase() === dataUser.password.toLowerCase())

          if (this.users) {

            localStorage.setItem("userId", this.users[0].idUser.toString());
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
          }

          });

    }

  }

  getUsers() {
    this.userService.getUsers().subscribe((data) => {
      console.log(data);
      this.users = data;
      
    });
  }

}
