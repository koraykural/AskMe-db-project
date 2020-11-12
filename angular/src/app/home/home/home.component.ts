import { Component, OnInit } from '@angular/core';
import { PostData } from '../components/post/post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  questions: PostData[] = [
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
    // {
    //   ownerUsername: "koray",
    //   userVote: null,
    //   upCount: 18,
    //   downCount: 3,
    //   question: "Simple question text?",
    // },
  ];

  ngOnInit(): void {}
}
