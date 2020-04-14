import { Component, OnInit } from '@angular/core';
import { Reader } from '../entity/reader';
import { ReaderService } from '../reader.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {
  selectedReader: Reader;

  readers: Reader[];

  constructor(private readerService: ReaderService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getReaders();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.readerService.addReader({ name } as Reader)
      .subscribe(reader => {
        this.readers.push(reader);
      });
  }

  delete(reader: Reader): void {
    this.readers = this.readers.filter(h => h !== reader);
    this.readerService.deleteReader(reader).subscribe();
  }

  getReaders(): void {
    this.readerService.getReaders().subscribe(readers => this.readers = readers);
  }
}
