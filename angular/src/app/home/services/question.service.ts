import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Observer } from 'rxjs';
import { ApiService } from './api.service';
import { QuestionData } from 'src/app/interfaces';
import { QuestionFormUtils } from '../utils/question-form-utils';

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

  get oldestQuestionDate() {
    const qLength = this.questions.length;

    const date = qLength === 0 ? new Date() : new Date(this.questions[qLength - 1].createdAt);
    const offset = date.getTimezoneOffset();
    const rDate = new Date(date.getTime() + offset * 60 * 1000);
    return rDate;
  }

  constructor(private apiService: ApiService, private questionFormUtils: QuestionFormUtils) {}

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
    console.log('Question pack request made!');

    this.requestMade.next(true);
    this.apiService.getQuestionPack(this.oldestQuestionDate).subscribe(this.questionRequestHandler);
  }

  scrollEnd() {
    if (this.requestMade.value || this.noQuestionLeft) {
      return;
    }
    this.getQuestionPack();
  }
}
