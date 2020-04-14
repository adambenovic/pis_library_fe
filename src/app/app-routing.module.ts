import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderComponent } from './reader/reader.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReaderDetailComponent } from './reader-detail/reader-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'readers', component: ReaderComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: ReaderDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

