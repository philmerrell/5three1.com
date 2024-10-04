import { Component, Input, OnInit } from '@angular/core';
import { PRAttempt } from '../../../shared/services/personal-record.service';

@Component({
  selector: 'app-pr-attempts',
  templateUrl: './pr-attempts.component.html',
  styleUrls: ['./pr-attempts.component.scss'],
})
export class PrAttemptsComponent implements OnInit {
  @Input() attempts: PRAttempt[];
  @Input() unit: 'lb' | 'kg';

  constructor() { }

  ngOnInit() {}

}
