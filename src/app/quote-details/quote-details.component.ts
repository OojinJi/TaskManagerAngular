import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITask } from '../Interfaces/ITask';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.css']
})
export class QuoteDetailsComponent implements OnInit {
  quote: ITask = { Quote_Id: 0, Quote_Type: '', Contact: '', Task_Description: '', Due_Date: '', Task_Type: '' };

  
  constructor(private activatedroute: ActivatedRoute, private dataserivce: DataService, private route: Router) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) =>{
      let id = +params['id'];
      this.dataserivce.getDataByID(id).subscribe(data =>{
        var ImQuote = JSON.parse(JSON.stringify(data))
        this.quote.Quote_Type = ImQuote.Quote_Type;
        this.quote.Contact = ImQuote.Contact;
        this.quote.Task_Description = ImQuote.Task_Description;
        this.quote.Due_Date = ImQuote.Due_Date;
        this.quote.Task_Type = ImQuote.Task_Type;
      });
    });
  }

  return(){
    this.route.navigate(['home']);
  }

}
