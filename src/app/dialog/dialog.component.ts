import { Component, Inject, OnInit } from '@angular/core';
import { ITask } from "../Interfaces/ITask";
import * as _moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const moment = _moment;
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  val: string= '';
  quote:ITask = {Quote_Id: 0, Quote_Type: '', Contact: '', Task_Description: '', Due_Date: '', Task_Type: ''};
  date = moment();
  title = 'Add New Quote';
  dialog_form: any;

  get Quote_Id(){ return this.dialog_form.get('Quote_Id'); }
  get Quote_Type(){ return this.dialog_form.get('Quote_Type'); }
  get Contact(){ return this.dialog_form.get('Contact'); }
  get Task_Description(){ return this.dialog_form.get('Task_Description'); }
  get Due_Date(){ return this.dialog_form.get('Due_Date'); }
  get Task_Type(){ return this.dialog_form.get('Task_Type'); }

  hours = 12;
  minutes = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ITask, private dataservice: DataService) { }

  ngOnInit(): void {
    this.dialog_form = new FormGroup({
      'Quote_Id': new FormControl( 0, [Validators.required]),
      'Quote_Type': new FormControl('', [Validators.required]),
      'Contact': new FormControl( '', [Validators.required]),
      'Task_Description': new FormControl('' , [Validators.required]),
      'Due_Date': new FormControl(new Date(), [Validators.required]),
      'Task_Type': new FormControl('', [Validators.required]),
    });

    if(this.data){
      this.Quote_Id.value = this.data.Quote_Id; 
      this.Quote_Type.value = this.data.Quote_Type;
      this.Contact.value = this.data.Contact;
      this.Task_Description.value= this.data.Task_Description;
      this.Due_Date.value = new Date( this.data.Due_Date);
      this.Task_Type.value = this.data.Task_Type;
         
      this.title = "Update Quote"
    }else{
      this.title = "Add New Quote";
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>){
    this.date = moment(event.value);
    this.quote.Due_Date = this.date.year().toString() + '-' + this.date.month().toString() + '-' + this.date.day().toString() + 'T00:00' ;
  }

  SubmitForm(){
    this.quote.Quote_Id = this.Quote_Id.value; 
    this.quote.Quote_Type = this.Quote_Type.value;
    this.quote.Contact = this.Contact.value;
    this.quote.Task_Description= this.Task_Description.value;
    this.quote.Due_Date = moment( this.Due_Date.value).format('MM/DD/YYYY').toString();   
    this.quote.Task_Type = this.Task_Type.value;
    if(this.title == 'Update Quote'){
      this.dataservice.updateData(this.quote.Quote_Id, this.quote);
    }else{
        this.dataservice.addData(this.quote);
    }
         
  }

}
