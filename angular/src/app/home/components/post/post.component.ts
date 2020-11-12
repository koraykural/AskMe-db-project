import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

export interface PostData {
  ownerUsername: string;
  question: string;
  upCount: number;
  downCount: number;
  userVote: boolean | null;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() data: PostData;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  upVote() {
    this.data.userVote = this.data.userVote === true ? null : true;
  }

  downVote() {
    this.data.userVote = this.data.userVote === false ? null : false;
  }
}
