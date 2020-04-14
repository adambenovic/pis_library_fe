import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReaderService} from '../reader.service';
import { Reader } from '../entity/reader';

@Component({
  selector: 'app-reader-detail',
  templateUrl: './reader-detail.component.html',
  styleUrls: ['./reader-detail.component.css']
})
export class ReaderDetailComponent implements OnInit {
  @Input() reader: Reader;

  constructor(
    private route: ActivatedRoute,
    private readerService: ReaderService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getReader();
  }

  getReader(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.readerService.getReader(id)
      .subscribe(reader => this.reader = reader);
  }

  save(): void {
    this.readerService.updateReader(this.reader)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
