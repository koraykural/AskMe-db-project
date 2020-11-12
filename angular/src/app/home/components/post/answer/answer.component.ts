import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
  @Input() data: QuestionData;

  constructor() {}

  ngOnInit(): void {}
}
