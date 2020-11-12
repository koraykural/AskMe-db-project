import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-answer-multi-four',
  templateUrl: './answer-multi-four.component.html',
  styleUrls: ['./answer-multi-four.component.css'],
})
export class AnswerMultiFourComponent implements OnInit {
  @Input() data: QuestionData;

  constructor() {}

  ngOnInit(): void {}
}
