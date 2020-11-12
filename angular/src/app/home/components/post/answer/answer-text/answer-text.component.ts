import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-answer-text',
  templateUrl: './answer-text.component.html',
  styleUrls: ['./answer-text.component.css'],
})
export class AnswerTextComponent implements OnInit {
  @Input() data: QuestionData;

  constructor() {}

  ngOnInit(): void {}
}
