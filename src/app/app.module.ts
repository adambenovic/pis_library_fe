import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReadersComponent } from './readers/readers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReaderDetailComponent } from './reader-detail/reader-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HomepageComponent } from './homepage/homepage.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { YesNoPipe } from './pipe/yes-no.pipe'


@NgModule({
  declarations: [
    AppComponent,
    ReadersComponent,
    ReaderDetailComponent,
    MessagesComponent,
    DashboardComponent,
    RegistrationFormComponent,
    HomepageComponent,
    YesNoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
