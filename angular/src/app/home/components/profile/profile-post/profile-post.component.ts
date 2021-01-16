import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionData, Answer } from 'src/app/interfaces';
import { ApiService } from 'src/app/home/services/api.service';

@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.css'],
})
export class ProfilePostComponent implements OnInit {
  @Input() data: QuestionData;
  @Output() delete = new EventEmitter<number>();

  showAnswers = false;
  answers: Answer[] = [];
  deleteState: 'ready' | 'pending' = 'ready';
  editState: 'ready' | 'pending' | 'error' = 'ready';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  log(e: any) {
    console.log(e);
  }

  editQuestion() {
    this.editState = 'pending';
    this.apiService.editQuestion(this.data).subscribe(
      (res) => {
        console.log(res);
        this.editState = 'ready';
      },
      (err) => {
        console.log(err);
        this.editState = 'error';
      },
    );
  }

  deleteQuestion() {
    this.deleteState = 'pending';
    this.delete.emit(this.data.id);
  }
}
