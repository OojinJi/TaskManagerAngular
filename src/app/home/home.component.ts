import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { ITask } from '../Interfaces/ITask';
import { DataService } from '../services/data.service';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource = new MatTableDataSource<ITask>();
  tasks: ITask[] = [];
  displayedColumns: string[] = [];
  
  @ViewChild(MatPaginator, { static: true}) paginator!: MatPaginator;
  @ViewChild('secondDialog', { static: true})
  
  ConfirmDelete!: TemplateRef<any>;
  ComfirmDeleteDialog!: MatDialogRef<any, any>;
  desc = 'asc';
  sortColmn = 'Quote_Id';
  counter = 1;
  pagesSize = 0;
  totalEntries: number = 0;
  fromEntries: number = 0;
  toEntries = 0;
  pageIndex = 0;
  pageSizeOptions: number[] = [10, 15, 25, 50];
  pageIndexArray: number[] = [];
  activePage = 1;
  item: any;
  pageItemArry: number [] = [];
  quote:ITask = {Quote_Id: 0, Quote_Type: '', Contact: '', Task_Description: '', Due_Date: '', Task_Type: ''};

  constructor(private route: Router, private dataservice: DataService, public dialog: MatDialog) {
  
   }

  openDialog(){
    const dialogRef = this.dialog.open(DialogComponent, {data:{}});
    dialogRef.afterClosed().subscribe(result =>{
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.getAllQuotes();
  }

  getAllQuotes(){
    this.dataservice.getData().subscribe(data =>{
      this.tasks = JSON.parse(JSON.stringify(data));
    
      if(!this.tasks){
        debugger;
        this.tasks = this.dataservice.quotes;
          
        this.dataSource.data = this.tasks;
        this.displayedColumns = Object.keys(this.dataSource.data[0]);
        this.displayedColumns.push('Actions');
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = this.pageSizeOptions[0];
        this.paginator.length = this.dataSource.data.length;
      
        this.congfigPaginator();
        this.calculateRangeLabel() ;
      
      }else{
        debugger;
        this.dataSource.data = this.tasks;
        this.displayedColumns = Object.keys(this.dataSource.data[0]);
        this.displayedColumns.push('Actions');
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = this.pageSizeOptions[0];
        this.paginator.length = this.dataSource.data.length;
      
        this.congfigPaginator();
        this.calculateRangeLabel() ;
      }

      debugger;
      this.dataSource.data = this.tasks;
      this.displayedColumns = Object.keys(this.dataSource.data[0]);
      this.displayedColumns.push('Actions');
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSizeOptions[0];
      this.paginator.length = this.dataSource.data.length;
      
      this.congfigPaginator();
      this.calculateRangeLabel() ;
        
      this.dataservice.datachanged.subscribe(x => {
        
        let desc = this.desc;
        let sortColmn = this.sortColmn;
        this.tasks = x;
        this.dataSource.data = this.tasks;
        this.displayedColumns = Object.keys(this.dataSource.data[0]);
        this.displayedColumns.push('Actions');
        this.congfigPaginator();
        this.calculateRangeLabel() ;
        this.sortData(desc, sortColmn);
        });
      });
  }

  addData(){
    for (let i = 0; i < 25; i++) {
      var data = {
        "Quote_Id": 0,
        "Quote_Type": "autoAdd" + i,
        "Contact": "Angular",
        "Task_Description": "Description" + i,
        "Due_Date": "2011-11-11T00:00:00",
        "Task_Type": "TaskType" + 1
      }
      this.dataservice.addData(data);
    }
    this.getAllQuotes();
  }

  Logout(){
    //debugger;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

  previousitem() {
    this.paginator.previousPage();
    this.congfigPaginator();
    this.calculateRangeLabel();
    this.activePage = this.paginator.pageIndex +1; 
  
  }

  nextitem() {
    this.paginator.nextPage();
    this.congfigPaginator();
    this.calculateRangeLabel();
    
    this.activePage = this.paginator.pageIndex +1;
  }

  congfigPaginator() {
    this.pageIndexArray =[];
     for(let i=1; i<=this.paginator.getNumberOfPages();i++){
       if((this.paginator.pageIndex+1) < this.paginator.length){
         this.pageIndexArray.push(i)
       }
     }

  this.buildPage(this.paginator.pageIndex);
    this.dataSource.paginator = this.paginator;
  }
  
  selectPage(psg: number) {
    this.paginator.pageIndex = (psg - 1);
    this.congfigPaginator();
    this.calculateRangeLabel();
    this.activePage = this.paginator.pageIndex +1;
  
  }

  addTask(){
    const dialogRef = this.dialog.open(DialogComponent,{data:null});
    dialogRef.afterClosed().subscribe(result => {
      this.getAllQuotes();
      console.log(`Dialog result: ${result}`);
    });
  }

  updateTask(task: any){
    let quote : ITask = {Quote_Id: 0, Quote_Type: '', Contact: '', Task_Description: '', Due_Date: '', Task_Type: ''};
    quote.Quote_Id = task['Quote_Id']; 
    quote.Quote_Type = task['Quote_Type'];
    quote.Contact = task['Contact'];
    quote.Task_Description = task['Task_Description'];
    quote.Due_Date = task['Due_Date'];
    quote.Task_Type = task['Task_Type'];
  
    const dialogRef = this.dialog.open(DialogComponent,{data:quote});
      dialogRef.afterClosed().subscribe(result => {
        this.getAllQuotes();
        console.log(`Dialog result: ${result}`);
      });
  }

  details(task:any){
    this.route.navigate(['quote-details'],{queryParams:{id:task['Quote_Id']}});
  }

  deleteTask(task:any){
    this.ComfirmDeleteDialog = this.dialog.open(this.ConfirmDelete);
    this.ComfirmDeleteDialog.afterClosed().subscribe(dialogResult =>{
      if(dialogResult){
        this.dataservice.deleteItem(task['Quote_Id']);
      }

      this.getAllQuotes();
    });
  }

  onDismissDelete(){
  this.ComfirmDeleteDialog.close(false);
  }

  onConfirmDelete(){
    this.ComfirmDeleteDialog.close(true);
    //this.getAllQuotes();
  }

  setPageSizeOptions(event: Event) {
    this.paginator.pageSize= +( event.target as HTMLInputElement).value;
    this.paginator.pageIndex = 0;
    this.congfigPaginator();
    this.calculateRangeLabel();  
  }

  calculateRangeLabel(){
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;
    let length = this.paginator.length;
    this.item ="Showing "+ this.paginator._intl.getRangeLabel(pageIndex,pageSize,length).replace(String.fromCharCode(8211), 'to');
  }

  buildPage(currPage:number) {
    this.pageItemArry = [];
    let arry:number[] =[];
    if(this.paginator.getNumberOfPages()>=7){
      const trimStart = currPage;
      const trimEnd = trimStart + 7;
      const maxlength = this.pageIndexArray.length-1;
  
      if(trimStart >= this.pageIndexArray[this.pageIndexArray.length-6]){
        arry= this.pageIndexArray.slice( this.pageIndexArray[this.pageIndexArray.length-6], this.pageIndexArray.length);
      }else{
        if(trimEnd > (maxlength) ) {
          arry = this.pageIndexArray.slice(maxlength-7, this.pageIndexArray[maxlength]);
        }else{
          arry= this.pageIndexArray.slice(trimStart, trimEnd);
        }
      }

    }else{
      arry = this.pageIndexArray;
    }
   
    this.pageItemArry = arry;
    console.log(this.pageItemArry)
  }

  OrderBy(x: any){
    this.sortColmn = x.value;
    this.sortData(this.desc, this.sortColmn);
  }
  checkboxChange(event:any){
    if(event.checked){
      this.desc ='desc';
    }else{
      this.desc = 'asc';
    }
  
    this.sortData(this.desc, this.sortColmn);  
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(_direction:string, _active: string) {
    let SortDirection: SortDirection= "";

    if(_direction=='asc'){
      SortDirection = 'asc';
    } else{
      SortDirection = 'desc'
    }
  
    let sort:Sort ={direction:SortDirection, active:_active}
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
   
    this.dataSource.data = data.sort((a, b) => {
      const x = _active;
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Task_Type':
          return this.compare(a['Task_Type'], b['Task_Type'], isAsc);
        case 'QuoteType':
          return this.compare(a['Quote_Type'], b['Quote_Type'], isAsc);
        case 'Contact':
          return this.compare(a['Contact'], b['Contact'], isAsc);
        case 'Description':
          return this.compare(a['Task_Description'], b['Task_Description'], isAsc);
        case 'DueDate':
          return this.compare(a['Due_Date'], b['Due_Date'], isAsc);
        case _active:
          return this.compare(a['Quote_Id'], b['Quote_Id'], isAsc); 
        default:
          return 0;
      }
    });
  }

  applyFilter(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.congfigPaginator();
    this.calculateRangeLabel();  
   
  }
  
}
