import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  @Input() data: QuestionData;

  constructor() {}

  ngOnInit(): void {}
}
