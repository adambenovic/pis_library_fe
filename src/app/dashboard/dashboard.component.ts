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
  searchText;
  constructor(private readerService: ReaderService) { }

  ngOnInit() {
    this.getReaders();
  }

  getReaders(): void {
    this.readerService.getReaders()
      .subscribe(readers => this.readers = readers);
  }

  sortedReadersBy(prop: string) {
    return this.readers.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
}
