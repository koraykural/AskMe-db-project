import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public questionService: QuestionService, private userService: UserService) {}

  ngOnInit(): void {
    if (this.questionService.questions.length < 1) {
      this.questionService.getQuestionPack();
    }
  }
}
