import { Component, OnInit } from '@angular/core';
import { ReaderService } from '../service/reader.service';
import { Reader } from '../entity/reader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  readers: Reader[] = [];

  constructor(private readerService: ReaderService) { }

  ngOnInit() {
    this.getReaders();
  }

  getReaders(): void {
    this.readerService.getReaders()
      .subscribe(readers => this.readers = readers.slice(1, 5));
  }
}
