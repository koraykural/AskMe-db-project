import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserData } from './user.service';
import { Observable } from 'rxjs';
import { ApiResponse, QuestionData, QuestionForm } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserData() {
    return this.http.get<UserData>(`${environment.API_URL}/user/`);
  }

  createQuestion(questionForm: QuestionForm): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/question/create`, questionForm);
  }

  getAllQuestions() {
    return this.http.get<{ questions: QuestionData[] }>(`${this.baseUrl}/question/all`);
  }

  getQuestionPack(olderThan: Date) {
    const dStr = olderThan.getTime() / 1000;
    console.log(new Date(dStr * 1000));
    return this.http.get<{ questions: QuestionData[] }>(`${this.baseUrl}/question/pack?older_than=${dStr}`);
  }
}
