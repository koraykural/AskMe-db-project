import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';
import { ApiService } from 'src/app/home/services/api.service';

type AnswerStates = 'ready' | 'disabled' | 'pending' | 'correct' | 'false';

@Component({
  selector: 'app-answer-multi',
  templateUrl: './answer-multi.component.html',
  styleUrls: ['./answer-multi.component.css'],
})
export class AnswerMultiComponent implements OnInit {
  @Input() data: QuestionData;

  states: {
    1: AnswerStates;
    2: AnswerStates;
    3: AnswerStates;
    4: AnswerStates;
  } = {
    1: 'ready',
    2: 'ready',
    3: 'ready',
    4: 'ready',
  };

  get userAnswer() {
    if (!this.data.userAnswer) {
      return null;
    }

    return parseInt(this.data.userAnswer, 10);
  }

  get correctAnswer() {
    return this.data.correctAnswer;
  }

  constructor(private apiService: ApiService) {}

  disableAnswers() {
    this.states = {
      1: 'disabled',
      2: 'disabled',
      3: 'disabled',
      4: 'disabled',
    };
  }

  enableAnswers() {
    this.data.userAnswer = null;
    this.states = {
      1: 'ready',
      2: 'ready',
      3: 'ready',
      4: 'ready',
    };
  }

  setButtonStates() {
    if (this.userAnswer) {
      this.disableAnswers();
      this.states[this.correctAnswer] = 'correct';
    }

    if (this.userAnswer && this.correctAnswer !== this.userAnswer) {
      this.states[this.userAnswer] = 'false';
    }
  }

  ngOnInit(): void {
    this.setButtonStates();
  }

  submitAnswer(answer: number) {
    if (this.userAnswer) {
      return;
    }

    const answerStr = answer.toString();
    this.data.userAnswer = answerStr;

    this.disableAnswers();
    this.states[answer] = 'pending';

    this.apiService.postAnswer(this.data.id, answerStr).subscribe(
      (response) => {
        console.log(response);
        this.setButtonStates();
      },
      (error) => {
        console.log(error);
        this.enableAnswers();
      },
    );
  }
}
