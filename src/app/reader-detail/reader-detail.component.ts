import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReaderService} from '../service/reader.service';
import { Reader } from '../entity/reader';
import { Fee } from '../entity/fee'
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ValidationService} from '../service/validation.service';
import {ValidationObject} from '../entity/validationObject';
import {empty, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FeeService} from '../service/fee.service';
import {Router} from '@angular/router';
import {PhotoService} from '../service/photo.service';
import {FileUpload} from '../entity/uploadFile';

@Component({
  selector: 'app-reader-detail',
  templateUrl: './reader-detail.component.html',
  styleUrls: ['./reader-detail.component.css']
})
export class ReaderDetailComponent implements OnInit {
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
  get photo() { return this.registrationForm.get('photo'); }
  get photo_path() { return this.registrationForm.get('photo_path'); }
  get street() { return this.registrationForm.get('address').get('street'); }
  get number() { return this.registrationForm.get('address').get('number'); }
  get city() { return this.registrationForm.get('address').get('city'); }
  get zip() { return this.registrationForm.get('address').get('zip'); }

  constructor(
    private route: ActivatedRoute,
    private readerService: ReaderService,
    private validationService: ValidationService,
    private feeService: FeeService,
    private fileUploadService: PhotoService,
    private location: Location
  ) { }

  types: string[] = ['Dospelý', 'Študent(držiteľ ISIC karty)', 'Dieťa(do 15 rokov)', 'ZŤP', 'Dôchodca'];
  fees: Fee[] = [];
  selectedType: string;
  submitted: boolean;
  created: boolean;
  uploaded: boolean = true;
  registrationForm: FormGroup;
  @Input() reader: Reader;
  fileUpload: FileUpload = new FileUpload();
  imgURL: any;

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
      email: new FormControl('', {validators: Validators.required, asyncValidators: this.validateEmail.bind(this)}),
      phone: new FormControl('', {asyncValidators: this.validatePhone.bind(this)}),
      consent: new FormControl(''),
      accept: new FormControl(''),
      photo: new FormControl(''),
      photo_path: new FormControl(''),
      address: new FormGroup({
        street: new FormControl(''),
        number: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('[0-9]{5}')]),
      })
    });
    this.getReader();
    this.getFees();
  }

  getReader(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.readerService.getReader(id)
      .subscribe(
        reader => this.reader = reader,
        null,
        () => this.imgURL = 'http://localhost:8000/api/downloadFile/' + this.reader.photo_path,
      );
  }

  getFees(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.readerService.getReaderFees(id)
      .subscribe(fees => this.fees = fees);
  }

  save(): void {
    this.mapFormValuesToReader;
    this.readerService.updateReader(this.reader).subscribe();
  }

  mapFormValuesToReader(){
    this.reader.name = this.name.value;
    this.reader.surname = this.surname.value;
    this.reader.date_of_birth = this.date_of_birth.value;
    this.reader.personal_identification_number = this.personal_identification_number.value;
  this.reader.type = this.type.value;
  this.reader.isic_number = this.isic_number.value;
  this.reader.email = this.email.value;
  this.reader.phone = this.phone.value;
  this.reader.photo_path = this.photo_path.value;
  this.reader.consent = this.consent.value;
  this.reader.address.city = this.city.value;
  this.reader.address.number = this.number.value;
  this.reader.address.zip = this.zip.value;
  this.reader.address.street = this.street.value;
  }

  goBack(): void {
    this.location.back();
  }

  aprove(): void {

  }

  refuse(): void {

  }

  validateISIC(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const typeString = 'isic';
    const validationObject =  {
      value: ctrl.value,
      type: typeString
    } as ValidationObject;

    return this.validationService.validate(validationObject).pipe(
      map(valid => valid.valid ? null : { isicInvalid: true }),
      catchError(() => of(null))
    );
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

  changeType(e) {
    this.isic_number.clearValidators();
    this.selectedType = e.target.value;
    this.isic_number.setValue('');
    if (this.selectedType === '2: Študent(držiteľ ISIC karty)') {
      this.isic_number.setValidators(Validators.required);
      this.isic_number.setAsyncValidators(this.validateISIC.bind(this));
    }
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.uploadOneFile(file).subscribe(fileUpload => this.fileUpload = fileUpload);
      this.photo_path.setValue(file.name);
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileList[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
    this.uploaded = true;
  }
}
