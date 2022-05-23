import { Injectable } from "@angular/core";
import { IUser } from "../Interfaces/IUser";
import {HttpClient, HttpParams, HttpHeaders} from "@angular/common/http"
import { IRegisterConfirmation } from "../Interfaces/IRegisterConfirmation";
import { noUndefined } from "@angular/compiler/src/util";
import { ILoginConfirmation } from "../Interfaces/ILoginConfirmation";




@Injectable({
	providedIn: 'root'
})
export class LoginService{
	user: any;
	exsituser: any;
	checkUser: any;
	isUser : boolean = false;
	isLoggedIn = false;
	authToken:string = '';
	dataUrl = 'https://localhost:44336';

	constructor(private http: HttpClient){}

	getUserByName(name: string){
		//debugger;
		return this.http.get(this.dataUrl + '/api/UserInfoVM/' + name);
	}

	RegisterUser(_username: string, _password: string, _confirmedpassword: string){
		let registerresult: IRegisterConfirmation = {RegSuccess: false};
		let reg_result = new Promise<any>((resolve,reject)=>{
			this.getUserByName(_username).subscribe(data => {
				this.exsituser = data;
				//debugger;
				//alert(JSON.stringify(this.exsituser));
				if(!this.exsituser){
					debugger;
					if(_password == _confirmedpassword){
						debugger;
						let headersReg = {'Content-Type': 'application/json'}  
						let body = {
							"User_name" : _username, 
							"User_Password" : _password
						};
						this.http.post(this.dataUrl+'/api/UserInfoVM', JSON.stringify(body), {headers: headersReg}).subscribe(data => {
							console.log(data)
							//debugger;
							if(data){
								registerresult.RegSuccess = true;
								resolve(registerresult)
							}else{
								//debugger;
								let err = {'result': registerresult, 'message':' Unknown Error !'}
								  reject(err);
							}
						});
						this.isUser = true;
						//debugger;
					}	
				}else{
					//debugger;
					let err = {'result': registerresult, 'message':'User already Exist'}
					this.isUser = false;
					//debugger;
					reject(err);
				}
			});
		});
		return reg_result;
	}

	login(username: string, password:string) {
		
		var checkLogin: ILoginConfirmation = {LoginSuccess: true};
		
		let headersLogin = {'Content-Type': 'application/x-www-from-urlencoded'};

		let body = "grant_type=password&username=" + username + "&password=" + password;
		
		var loginPromise = new Promise<ILoginConfirmation>((resolve, rejects) => {
			this.http.post(this.dataUrl + '/token', body, {headers: headersLogin}).subscribe(token =>{
				this.authToken = JSON.parse(JSON.stringify(token)).access_token;
			
			if(this.authToken){
				checkLogin.LoginSuccess = true;
				resolve(checkLogin);
			}else{
				checkLogin.LoginSuccess = false;
				rejects(checkLogin);
			}
			});
		});
		return loginPromise;
	}
}
		
	