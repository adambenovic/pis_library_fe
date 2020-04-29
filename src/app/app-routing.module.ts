import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadersComponent } from './readers/readers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReaderDetailComponent } from './reader-detail/reader-detail.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'readers', component: ReadersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'readers/detail/:id', component: ReaderDetailComponent },
  { path: 'register', component: RegistrationFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

