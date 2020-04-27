import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Reader} from '../entity/reader';
import {ReaderService} from '../service/reader.service';
import {MessageService} from '../service/message.service';
import {ValidationService} from '../service/validation.service';
import {ValidationObject} from '../entity/validationObject';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FeeService} from '../service/fee.service';
import {GeneratedFee} from '../entity/generatedFee';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  get name() { return this.registrationForm.get('name'); }
  get surname() { return this.registrationForm.get('surname'); }
  get date_of_birth() { return this.registrationForm.get('date_of_birth'); }
  get personal_identification_number() { return this.registrationForm.get('personal_identification_number'); }
  get type() { return this.registrationForm.get('type'); }
  get isic_number() { return this.registrationForm.get('isic_number'); }
  get email() { return this.registrationForm.get('email'); }
  get phone() { return this.registrationForm.get('phone'); }
  get consent() { return this.registrationForm.get('consent'); }
  get accept() { return this.registrationForm.get('accept'); }
  get fee() { return this.registrationForm.get('fee'); }
  get street() { return this.registrationForm.get('address').get('street'); }
  get number() { return this.registrationForm.get('address').get('number'); }
  get city() { return this.registrationForm.get('address').get('city'); }
  get zip() { return this.registrationForm.get('address').get('zip'); }

  constructor(
    private readerService: ReaderService,
    private messageService: MessageService,
    private validationService: ValidationService,
    private feeService: FeeService,
    private router: Router
  ) { }
  types: string[] = ['Dospelý', 'Študent(držiteľ ISIC karty)', 'Dieťa(do 15 rokov)', 'ZŤP', 'Dôchodca'];
  selectedType: string;
  submitted: boolean;
  created: boolean;
  registrationForm: FormGroup;
  reader: Reader;

  generatedFee: GeneratedFee = new GeneratedFee();

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', Validators.required),
      personal_identification_number: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(9),
        Validators.pattern('^[0-9]{9,10}$')
      ]),
      type: new FormControl(this.types[0], Validators.required),
      isic_number: new FormControl(''),
      email: new FormControl('', {updateOn: 'blur', validators: Validators.required, asyncValidators: this.validateEmail.bind(this)}),
      phone: new FormControl('', {updateOn: 'blur', validators: Validators.required, asyncValidators: this.validatePhone.bind(this)}),
      consent: new FormControl(''),
      accept: new FormControl(''),
      fee: new FormControl(''),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('[0-9]{5}')]),
      })
    });
  }

  onSubmit() {
    this.submitted = true;
    this.personal_identification_number.setAsyncValidators(this.validateDuplicity.bind(this));
    this.personal_identification_number.updateValueAndValidity();
    this.registrationForm.disable();
    this.feeService.getFee(this.type.value).subscribe(generatedFee => this.generatedFee = generatedFee);
    this.fee.disable();
    this.consent.enable();
    this.accept.enable();
    this.consent.setValidators(Validators.required);
    this.accept.setValidators(Validators.required);
  }

  sendToBackend() {
    this.registrationForm.enable();
    this.readerService.addReader(this.registrationForm.value as Reader).subscribe(reader => this.reader = reader);
    this.registrationForm.disable();
    this.created = true;
  }

  changeType(e) {
    this.isic_number.clearValidators();
    this.selectedType = e.target.value;
    this.isic_number.setValue('');
    if (this.selectedType === '2: Študent(držiteľ ISIC karty)') {
      this.isic_number.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    }
  }

  validateEmail(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const typeString = 'email';
    const validationObject =  {
      value: ctrl.value,
      type: typeString
    } as ValidationObject;

    return this.validationService.validate(validationObject).pipe(
      map(valid => valid.valid ? null : { emailInvalid: true }),
      catchError(() => of(null))
    );
  }

  validatePhone(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const typeString = 'phone';
    const validationObject =  {
      value: ctrl.value,
      type: typeString
    } as ValidationObject;

    return this.validationService.validate(validationObject).pipe(
      map(valid => (valid.valid ? null : { phoneInvalid: true })),
      catchError(() => of(null))
    );
  }

  validateDuplicity(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const typeString = 'personal_identification_number';
    const validationObject =  {
      value: ctrl.value,
      type: typeString
    } as ValidationObject;

    return this.validationService.validate(validationObject).pipe(
      map(valid => valid.valid ? null : { PINInvalid: true }),
      catchError(() => of(null))
    );
  }

  redirectToHP() {
    this.router.navigate(['/readers/detail', this.reader.id]);
  }
}
