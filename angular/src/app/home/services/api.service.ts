import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserData } from './user.service';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  QuestionData,
  QuestionForm,
  ContactForm,
  Answer,
  ApiError,
  Statistics,
} from 'src/app/interfaces';
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
    return this.http.post<ApiResponse>(`${this.baseUrl}/question/`, questionForm);
  }

  editQuestion(questionData: QuestionData): Observable<ApiResponse | ApiError> {
    return this.http.put<ApiResponse | ApiError>(
      `${this.baseUrl}/question/${questionData.id}`,
      questionData,
    );
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

  getQuestionOfUser() {
    return this.http.get<{ questions: QuestionData[] }>(`${this.baseUrl}/question/ofuser`);
  }

  deleteQuestion(id: number) {
    return this.http.delete<ApiResponse | ApiError>(`${this.baseUrl}/question/${id}`);
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

  getAnswers(questionId: number) {
    return this.http.get<Answer[]>(`${this.baseUrl}/answer/?question_id=${questionId}`);
  }

  postAnswer(questionId: number, answer: string) {
    return this.http.post<ApiResponse | ApiError>(`${this.baseUrl}/answer/`, {
      question_id: questionId,
      answer,
    });
  }

  likeAnswer(questionId: number, userId: string) {
    return this.http.post<ApiResponse | ApiError>(`${this.baseUrl}/answer/like`, {
      question_id: questionId,
      user_id: userId,
    });
  }

  dislikeAnswer(questionId: number, userId: string) {
    return this.http.post<ApiResponse | ApiError>(`${this.baseUrl}/answer/dislike`, {
      question_id: questionId,
      user_id: userId,
    });
  }

  deleteAnswer(questionId: number) {
    return this.http.delete<ApiResponse | ApiError>(`${this.baseUrl}/answer/${questionId}`);
  }

  editAnswer(questionId: number, answer: string) {
    return this.http.put<ApiResponse | ApiError>(`${this.baseUrl}/answer/${questionId}`, {
      answer,
    });
  }

  changeEmail(email: string) {
    return this.http.put<ApiResponse | ApiError>(`${this.baseUrl}/user/email`, { email });
  }

  changeUsername(username: string) {
    return this.http.put<ApiResponse | ApiError>(`${this.baseUrl}/user/username`, { username });
  }

  changePassword(password: string) {
    return this.http.put<ApiResponse | ApiError>(`${this.baseUrl}/user/password`, {
      new_password: password,
    });
  }

  deleteAccount() {
    return this.http.delete<ApiResponse | ApiError>(`${this.baseUrl}/user/`);
  }

  getStats() {
    return this.http.get<Statistics>(`${this.baseUrl}/user/stats`);
  }
}
