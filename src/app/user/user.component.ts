import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ConfirmedPasswordValidator } from '../confirm-password-validator';
import {LoginService} from '../services/login.service';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loginbox= true;
  loginForm:any;
  registerForm:any;
  registerbox = false;
  token:string = '';
  get login_name() { return this.loginForm.get('userName'); }
  get login_password() { return this.loginForm.get('password'); }
  get register_name() { return this.registerForm.get('username'); }
  get register_password() { return this.registerForm.get('password'); }
  get f(){
    return this.registerForm.controls;
  }

  constructor(private loginservice: LoginService, private router: Router, private fb:FormBuilder, private notificationservice:NotificationService) { }

  ngOnInit(): void {
    this.loginForm  = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    this.registerForm = this.fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required])},
        
    { validator: ConfirmedPasswordValidator('password', 'confirmpassword')});
      
  }

  loginSubmit(){
    var UserInfo = this.loginForm.value;
     this.loginservice.login(UserInfo.userName, UserInfo.password).then(
       res => {
          if (res.LoginSuccess){
            this.loginservice.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', this.loginservice.authToken);
            this.notificationservice.openSnackBar("Login Successful!");
            this.router.navigate(['/home']);
            console.log(res);
          }
       }, (err) => {
          this.notificationservice.openSnackBar("Login Failed!");
       }
     )
  }

  registerSubmit(){
    let users = this.registerForm.value;
    //debugger;
    this.loginservice.RegisterUser(users.username, users.password, users.confirmpassword).then(res=>{
      this.notificationservice.openSnackBar("Registration Successful!");
    localStorage.setItem('isLoggedIn', 'true');  
    }, (err)=>{
      this.notificationservice.openSnackBar("Registration Failed!   " + err.message);
    });
  }

  switchtabs(){
    this.loginForm.reset();
    this.registerForm.reset();
    this.loginbox = !this.loginbox;
    this.registerbox = !this.registerbox;
  }

}
