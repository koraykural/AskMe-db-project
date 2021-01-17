import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { QuestionData, Statistics } from 'src/app/interfaces';
import { transition, style, animate, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('questionsAnimation', [
      transition('* <=> *', [
        query(
          ':leave',
          [
            style({ overflow: 'hidden' }),
            animate(
              '600ms ease-in-out',
              style({ height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }),
            ),
          ],
          {
            optional: true,
          },
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            animate(
              '600ms ease-in-out',
              style({
                opacity: 1,
              }),
            ),
          ],
          {
            optional: true,
          },
        ),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  questions: QuestionData[] = [];
  stats: Statistics = {
    questionCount: 0,
    totalUpvote: 0,
    maxUpvote: 0,
    totalDownvote: 0,
    maxDownvote: 0,
    totalAnswers: 0,
    maxAnswers: 0,
  };

  newEmail = '';
  newUsername = '';
  newPassword = '';

  emailBtn: 'ready' | 'waiting' | 'error' = 'ready';
  usernameBtn: 'ready' | 'waiting' | 'error' = 'ready';
  passwordBtn: 'ready' | 'waiting' | 'error' = 'ready';
  deleteBtn: 'ready' | 'waiting' | 'error' = 'ready';

  emailErrMsg = '';
  usernameErrMsg = '';
  passwordErrMsg = '';
  deleteErrMsg = '';

  constructor(
    public userService: UserService,
    private apiService: ApiService,
    private authService: AuthService,
  ) {
    this.userService.userDataExists.subscribe((val) => {
      if (val) {
        this.newEmail = this.userService.userData.email;
        this.newUsername = this.userService.userData.username;
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getQuestionOfUser().subscribe((res) => {
      this.questions = res.questions;
    });
    this.apiService.getStats().subscribe((res) => {
      this.stats = res;
      console.log(res);
    });
  }

  saveEmail() {
    this.emailErrMsg = '';
    if (this.newEmail.length < 3) {
      this.emailErrMsg = 'Email is invalid.';
      return;
    }

    this.emailBtn = 'waiting';
    this.apiService.changeEmail(this.newEmail).subscribe(
      (res) => {
        this.emailErrMsg = '';
        this.emailBtn = 'ready';
        this.userService.setUserData();
      },
      (err) => {
        this.emailBtn = 'error';
        this.emailErrMsg = 'Email could not be changed. Sorry.';
      },
    );
  }

  saveUsername() {
    this.usernameErrMsg = '';
    if (this.newUsername.length < 3 || this.newUsername.length > 20) {
      this.usernameErrMsg = 'Username length must be between 3-20';
      return;
    }

    this.usernameBtn = 'waiting';
    this.apiService.changeUsername(this.newUsername).subscribe(
      (res) => {
        this.usernameErrMsg = '';
        this.usernameBtn = 'ready';
        this.userService.setUserData();
      },
      (err) => {
        this.usernameBtn = 'error';
        this.usernameErrMsg = 'Username could not be changed. Sorry.';
      },
    );
  }

  savePassword() {
    this.passwordErrMsg = '';
    if (this.newPassword.length < 8 || this.newPassword.length > 30) {
      this.passwordErrMsg = 'Password length must be between 8-30';
      return;
    }

    this.passwordBtn = 'waiting';
    this.apiService.changePassword(this.newPassword).subscribe(
      (res) => {
        this.passwordErrMsg = '';
        this.passwordBtn = 'ready';
      },
      (err) => {
        this.passwordErrMsg = 'Password could not be changed. Sorry.';
        this.passwordBtn = 'error';
      },
    );
  }

  deleteAccount() {
    this.deleteErrMsg = '';
    this.deleteBtn = 'waiting';
    this.apiService.deleteAccount().subscribe(
      (res) => {
        this.authService.logout();
      },
      (err) => {
        this.deleteBtn = 'error';
        this.deleteErrMsg = 'Account could not be deleted. Sorry.';
      },
    );
  }

  questionDeleted(id: number) {
    const index = this.questions.findIndex((el) => el.id === id);
    if (index !== -1) {
      this.apiService.deleteQuestion(id).subscribe(
        (res) => {
          this.questions.splice(index, 1);
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
}
