import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
	providedIn: 'root'
  })
  export class AuthGaurdGuard implements CanActivate {
	constructor(private loginservice:LoginService, private router:Router){}
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
	let isloggin = localStorage.getItem('isLoggedIn');
	if(isloggin=='true'){
	  this.loginservice.isLoggedIn = true
	}
	else {
	  this.loginservice.isLoggedIn = false;
	}
	if(!this.loginservice.isLoggedIn){
	this.router.navigate(['login']);
	  }
   return this.loginservice.isLoggedIn;
	}
	
  }