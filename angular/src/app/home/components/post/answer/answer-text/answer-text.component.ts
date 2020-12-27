import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/home/services/api.service';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const userAnswer = this.data?.userAnswer;
    if (userAnswer) {
      this.answer.setValue(userAnswer);
      this.buttonState = 'submitted';
      this.answerForm.disable();
    }
  }

  submit() {
    if (this.answerForm.invalid) {
      return false;
    }
    const answer = this.answer.value;
    this.answerForm.disable();
    this.buttonState = 'submitted';
    this.apiService.postAnswer(this.data.id, answer).subscribe(
      (response) => {},
      (error) => {
        console.log(error);
        this.buttonState = 'ready';
        this.answerForm.enable();
      },
    );
  }
}
