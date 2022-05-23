import { getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../Interfaces/ITask';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  datachanged:Subject<ITask[]> = new Subject<ITask[]>();
  quotes:ITask[] = [];
  constructor(private http: HttpClient) { }
  dataUrl = 'https://localhost:44336/api/QuoteInfoVM';
  headersReg = {'Authorization': 'Bearer ' + localStorage.getItem("token"), 'Access-Control-Allow-Origin': 'http://localhost:44336', 'Content-Type': 'application/json'}; 

  getData(){
    return this.http.get<ITask[]>(this.dataUrl, {headers: this.headersReg});
  }

  getDataByID(id: number){
    //debugger
    return this.http.get<ITask[]>(this.dataUrl + '/' + id, {headers: this.headersReg});
  }

  updateData(id: number, quote:ITask){  
    //debugger;
      this.http.put(this.dataUrl + '/' + id, JSON.stringify(quote), {headers: this.headersReg}).subscribe(data => {
        this.quotes.push(JSON.parse(JSON.stringify(data)));
        this.datachanged.next(this.quotes);
      });
  }

  addData(quote: ITask){
    //debugger
    return this.http.post(this.dataUrl, JSON.stringify(quote), {headers: this.headersReg}).subscribe(data => {
        this.quotes.push(JSON.parse(JSON.stringify(data)));
        this.datachanged.next(this.quotes);
    });
  }

  deleteItem(id: number){
    return this.http.delete(this.dataUrl + '/' + id, {headers: this.headersReg}).subscribe(data => {
      this.quotes.push(JSON.parse(JSON.stringify(data)));
      //this.datachanged.next(this.quotes);
    });
  }
}

