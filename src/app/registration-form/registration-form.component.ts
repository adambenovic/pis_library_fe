import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Reader} from '../entity/reader';
import {ReaderService} from '../service/reader.service';
import {MessageService} from '../service/message.service';
import {ValidationService} from '../service/validation.service';
import {ValidationObject} from '../entity/validationObject';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  types: string[] = ['Dospelý', 'Študent(držiteľ ISIC karty)', 'Dieťa(do 15 rokov)', 'ZŤP', 'Dôchodca'];
  selectedType: string;

  registrationForm: FormGroup;

  get name() { return this.registrationForm.get('name'); }
  get surname() { return this.registrationForm.get('surname'); }
  get date_of_birth() { return this.registrationForm.get('date_of_birth'); }
  get personal_identification_number() { return this.registrationForm.get('personal_identification_number'); }
  get type() { return this.registrationForm.get('type'); }
  get isic_number() { return this.registrationForm.get('isic_number'); }
  get email() { return this.registrationForm.get('email'); }
  get phone() { return this.registrationForm.get('phone'); }
  get consent() { return this.registrationForm.get('consent'); }
  get street() { return this.registrationForm.get('street'); }
  get number() { return this.registrationForm.get('number'); }
  get city() { return this.registrationForm.get('city'); }
  get zip() { return this.registrationForm.get('zip'); }

  constructor(
    private readerService: ReaderService,
    private messageService: MessageService,
    private validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)
      ]),
      personal_identification_number: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      type: new FormControl(this.types[0], Validators.required),
      isic_number: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.pattern('\+421[0-9]{9}')),
      consent: new FormControl('', Validators.requiredTrue),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('[0-9]{5}')]),
      })
    });
  }

  onSubmit() {
    this.readerService.addReader(this.registrationForm.value as Reader).subscribe();
  }

  changeType(e) {
    this.selectedType = e.target.value;
    if (this.selectedType === '2: Študent(držiteľ ISIC karty)') {
      this.isic_number.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    }
    else {
      this.isic_number.clearValidators();
    }
  }

  validateEmail(email: string) {
    const type = 'email';
    this.validationService.validate({email, type} as unknown as ValidationObject);
  }

  validatePhone(phone: string) {
    const type = 'email';
    this.validationService.validate({phone, type} as unknown as ValidationObject);
  }
}
