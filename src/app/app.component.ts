import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( public login:LoginService, private router:Router){}
  
  logOut(){
    localStorage.setItem('isLoggedIn', 'false');
    this.login.isLoggedIn = false;
    this.router.navigate(['login']);

  }
}
