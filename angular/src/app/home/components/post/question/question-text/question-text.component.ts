import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question-text',
  templateUrl: './question-text.component.html',
  styleUrls: ['./question-text.component.css'],
})
export class QuestionTextComponent implements OnInit {
  @Input() questionText: string;

  constructor() {}

  ngOnInit(): void {}
}
