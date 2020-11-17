import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-answer-text',
  templateUrl: './answer-text.component.html',
  styleUrls: ['./answer-text.component.css'],
})
export class AnswerTextComponent implements OnInit {
  @Input() data: QuestionData;

  buttonState: 'ready' | 'submitted' = 'ready';
  icons = {
    ready: 'paper-plane',
    submitted: 'check-circle',
  };

  answerForm = new FormGroup({
    answer: new FormControl('', Validators.required),
  });

  get answer() {
    return this.answerForm.get('answer');
  }

  constructor() {}

  ngOnInit(): void {}

  submit() {
    if (this.answerForm.valid) {
      console.log(this.answer.value);
      this.answerForm.disable();
      this.buttonState = 'submitted';
    }
    return false;
  }
}
