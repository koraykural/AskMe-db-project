import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserData } from './user.service';
import { Observable } from 'rxjs';
import { ApiResponse, QuestionData, QuestionForm, ContactForm } from 'src/app/interfaces';
import { AuthService } from 'src/app/auth/auth.service';

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

  getQuestionPack(olderThan: number) {
    console.log(new Date(olderThan * 1000).toUTCString());
    return this.http.get<{ questions: QuestionData[] }>(
      `${this.baseUrl}/question/pack?older_than=${olderThan}`,
    );
  }

  vote(questionId: number, userId: string, vote: 'up' | 'down') {
    return this.http.post(`${this.baseUrl}/vote/${vote}`, {
      question_id: questionId,
      user_id: userId,
    });
  }

  deleteVote(questionId: number, userId: string) {
    return this.http.post(`${this.baseUrl}/vote/delete`, {
      question_id: questionId,
      user_id: userId,
    });
  }

  postContactForm(form: ContactForm) {
    form._subject = `AskMe - ${form._subject}`;
    return this.http.post('https://formspree.io/f/mqkggdzr', form);
  }
}
