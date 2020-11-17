import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { QuestionData } from 'src/app/interfaces';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() data: QuestionData;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  upVote() {
    this.data.userVote = this.data.userVote === true ? null : true;
  }

  downVote() {
    this.data.userVote = this.data.userVote === false ? null : false;
  }

  relativeDate(d: Date) {
    const date = new Date(d);
    const offset = date.getTimezoneOffset();
    const rDate = new Date(date.getTime() + offset * 60 * 1000);
    return rDate;
  }
}
