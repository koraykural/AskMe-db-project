import { Component, OnInit, Input } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() data: QuestionData;
  previousVote: boolean;

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
}
