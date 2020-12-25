import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Observer } from 'rxjs';
import { ApiService } from './api.service';
import { QuestionData } from 'src/app/interfaces';
import { QuestionFormUtils } from '../utils/question-form-utils';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  requestMade = new BehaviorSubject(false);
  noQuestionLeft = false;
  questions: QuestionData[] = [];

  questionRequestHandler: Observer<{ questions: QuestionData[] }> = {
    next: (res) => {
      console.log(res);
      this.questions = this.questions.concat(res.questions);
      this.requestMade.next(false);
      if (res.questions.length < 5) {
        this.noQuestionLeft = true;
      }
    },
    error: (err) => {
      console.log(err);
      this.requestMade.next(false);
    },
    complete: () => {},
  };

  get oldestQuestionDate(): number {
    const qLength = this.questions.length;
    let qDate: number;

    if (qLength === 0) {
      qDate = Date.now();
    } else {
      const date = new Date(this.questions[qLength - 1].createdAt);
      qDate = date.getTime();
    }

    return qDate / 1000;
  }

  constructor(
    private apiService: ApiService,
    private questionFormUtils: QuestionFormUtils,
    private authService: AuthService,
  ) {
    this.authService.isAuthenticated.subscribe((val) => {
      if (!val) {
        this.reset();
      }
    });
  }

  questionFormValidator() {
    return this.questionFormUtils.questionFormValidator.bind(this.questionFormUtils);
  }

  submitQuestionForm(f: FormGroup): Observable<any> {
    return this.apiService.createQuestion(this.questionFormUtils.reduceQuestionForm(f));
  }

  getAllQuestions() {
    this.requestMade.next(true);
    this.apiService.getAllQuestions().subscribe(this.questionRequestHandler);
  }

  getQuestionPack() {
    this.requestMade.next(true);
    this.apiService.getQuestionPack(this.oldestQuestionDate).subscribe(this.questionRequestHandler);
  }

  scrollEnd() {
    if (this.requestMade.value || this.noQuestionLeft) {
      return;
    }
    this.getQuestionPack();
  }

  reset() {
    this.questions = [];
    this.requestMade.next(false);
    this.noQuestionLeft = false;
  }
}
