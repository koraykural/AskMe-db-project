import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-answer-multi-two',
  templateUrl: './answer-multi-two.component.html',
  styleUrls: ['./answer-multi-two.component.css'],
})
export class AnswerMultiTwoComponent implements OnInit {
  @Input() data: QuestionData;

  constructor() {}

  ngOnInit(): void {}
}
