import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { AuthGaurdGuard } from './services/auth-gaurd.guard';

const routes: Routes = [
  {path:'login', component: UserComponent},
  {path:'home', component: HomeComponent, canActivate:[AuthGaurdGuard]},
  {path:'quote-details', component:QuoteDetailsComponent, canActivate:[AuthGaurdGuard]},
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'**', redirectTo:'/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
