import { Component, OnInit, Input } from '@angular/core';
import { QuestionData, Answer } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { transition, style, animate, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  animations: [
    trigger('removeAnswer', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({
              overflow: 'hidden',
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
            }),
            animate(
              '200ms ease-in-out',
              style({
                height: '*',
                marginTop: '*',
                marginBottom: '*',
                paddingTop: '*',
                paddingBottom: '*',
              }),
            ),
          ],
          {
            optional: true,
          },
        ),
        query(
          ':leave',
          [
            style({ overflow: 'hidden' }),
            animate(
              '400ms ease-in-out',
              style({
                height: 0,
                opacity: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
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
export class PostComponent implements OnInit {
  @Input() data: QuestionData;
  previousVote: boolean;

  showAnswers = false;
  answers: Answer[] = [];

  constructor(private apiService: ApiService, private userService: UserService) {}

  ngOnInit(): void {}

  sendVoteRequest() {
    const newVote = this.data.userVote;
    const questionId = this.data.id;
    const userId = this.userService.userData.id;
    if (newVote === null) {
      this.voteRequest(this.apiService.deleteVote(questionId, userId));
    } else if (newVote) {
      this.voteRequest(this.apiService.vote(questionId, userId, 'up'));
    } else {
      this.voteRequest(this.apiService.vote(questionId, userId, 'down'));
    }
  }

  voteRequest(request: Observable<any>) {
    request.subscribe(
      (response) => {},
      (err) => {
        console.log(err);

        const oldVote = this.data.userVote;
        this.data.userVote = this.previousVote;
        this.previousVote = oldVote;
        this.voteChanged();
      },
    );
  }

  voteChanged() {
    const oldVote = this.previousVote;
    const newVote = this.data.userVote;

    if (newVote === true) {
      this.data.upvoteCount++;
    }
    if (newVote === false) {
      this.data.downvoteCount++;
    }
    if (oldVote === true) {
      this.data.upvoteCount--;
    }
    if (oldVote === false) {
      this.data.downvoteCount--;
    }
  }

  upVote() {
    this.previousVote = this.data.userVote === undefined ? null : this.data.userVote;
    this.data.userVote = this.data.userVote === true ? null : true;
    this.voteChanged();
    this.sendVoteRequest();
  }

  downVote() {
    this.previousVote = this.data.userVote === undefined ? null : this.data.userVote;
    this.data.userVote = this.data.userVote === false ? null : false;
    this.voteChanged();
    this.sendVoteRequest();
  }

  answerDeleted(userId: string) {
    // Remove userId from this.answers
    const index = this.answers.findIndex((x) => x.userId === userId);
    if (index === -1) {
      return;
    }

    this.apiService.deleteAnswer(this.answers[index].questionId).subscribe(
      (res) => {
        this.answers.splice(index, 1);
      },
      (err) => {},
    );
  }

  toggleShowAnswers() {
    this.showAnswers = !this.showAnswers;

    if (this.showAnswers) {
      this.apiService.getAnswers(this.data.id).subscribe(
        (answers) => {
          console.log(answers);
          this.answers = answers;
        },
        (error) => {
          console.log(error);
          this.toggleShowAnswers();
        },
      );
    } else {
      this.answers = [];
    }
  }
}
