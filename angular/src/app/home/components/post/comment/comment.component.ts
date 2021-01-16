import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from 'src/app/interfaces';
import { UserService } from 'src/app/home/services/user.service';
import { ApiService } from 'src/app/home/services/api.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() data: Answer;
  @Output() deleted = new EventEmitter<string>();

  editActive = false;

  get isOwner() {
    return this.userService.userData.id === this.data.userId;
  }

  constructor(private userService: UserService, private apiService: ApiService) {}

  ngOnInit(): void {}

  like() {
    this.data.likes = this.data.likes + 1;
    this.apiService.likeAnswer(this.data.questionId, this.data.userId).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
        this.data.likes = this.data.likes - 1;
      },
    );
  }

  dislike() {
    this.data.dislikes = this.data.dislikes + 1;
    this.apiService.dislikeAnswer(this.data.questionId, this.data.userId).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
        this.data.dislikes = this.data.dislikes - 1;
      },
    );
  }

  activateEdit() {
    this.editActive = true;
  }

  saveEdit() {
    this.editActive = false;
    this.apiService.editAnswer(this.data.questionId, this.data.answer).subscribe(
      (res) => {},
      (err) => {},
    );
  }

  deleteAnswer() {
    this.deleted.emit(this.data.userId);
  }
}
