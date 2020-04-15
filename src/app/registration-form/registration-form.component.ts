import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  types: string[] = ['Dospelý', 'Študent(držiteľ ISIC karty)', 'Dieťa(do 15 rokov)', 'ZŤP', 'Dôchodca'];

  selectedType: string;

  registrationForm = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    dateOfBirth: new FormControl(''),
    personalIdentificationNumber: new FormControl(''),
    type: new FormControl(''),
    isicNumber: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    consent: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      number: new FormControl(''),
      city: new FormControl(''),
      zip: new FormControl(''),
    })
  });

  constructor() {  }

  onSubmit() {
    alert(JSON.stringify(this.registrationForm.value));
  }

  changeType(e) {
    this.selectedType = e.target.value;
  }
}
