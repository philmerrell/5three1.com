import { Component, Input, OnInit } from '@angular/core';
import { PRAttempt } from '../../../shared/services/personal-record.service';

@Component({
  selector: 'app-personal-records',
  templateUrl: './personal-records.component.html',
  styleUrls: ['./personal-records.component.scss'],
})
export class PersonalRecordsComponent implements OnInit {
  @Input() records: PRAttempt[];
  @Input() unit: 'lb' | 'kg';
  
  constructor() { }

  ngOnInit() {}

}
